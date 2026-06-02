import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Order } from '../models/Order';
import { Template } from '../models/Template';
import { Instance } from '../models/Instance';
import { deployInstanceBackground } from '../services/deploy.service';

const router = Router();

const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

// ─── POST /api/payments/easykash/initiate ─────────────────────────────────────
// Called from the store when user submits the purchase form.
// Creates a pending order then returns an EasyKash hosted-payment URL.
router.post('/initiate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { templateId, customerName, customerEmail, customerPhone, instanceSlug, instancePassword } =
      req.body as {
        templateId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        instanceSlug: string;
        instancePassword: string;
      };

    // Validate required fields
    if (!templateId || !customerName || !customerEmail || !customerPhone || !instanceSlug || !instancePassword) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Validate slug format
    if (!SLUG_RE.test(instanceSlug) || instanceSlug.length < 3 || instanceSlug.length > 40) {
      res.status(400).json({ error: 'Invalid slug format' });
      return;
    }

    // Check slug availability
    const slugTaken = await Instance.findOne({ slug: instanceSlug });
    if (slugTaken) {
      res.status(409).json({ error: 'Slug already taken' });
      return;
    }

    // Fetch template
    const template = await Template.findById(templateId);
    if (!template || template.status !== 'active') {
      res.status(404).json({ error: 'Template not found' });
      return;
    }

    const isOnSale =
      template.salePrice != null &&
      (!template.saleEndsAt || new Date(template.saleEndsAt).getTime() > Date.now());
    const amount = isOnSale ? template.salePrice! : template.price;

    // Create order
    const order = await Order.create({
      templateId,
      customerName,
      customerEmail,
      customerPhone,
      instanceSlug,
      instancePassword, // stored plain until deployed
      paymentMethod: 'easykash',
      status: 'pending',
      notes: `EasyKash — ${template.name}`,
    });

    const storeUrl = process.env.STORE_URL || 'http://localhost:5173';

    // Call EasyKash Pay API
    const ekRes = await fetch('https://back.easykash.net/api/directpayv1/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: process.env.EASYKASH_API_KEY!,
      },
      body: JSON.stringify({
        amount,
        currency: 'EGP',
        name: customerName,
        email: customerEmail,
        mobile: customerPhone,
        redirectUrl: `${storeUrl}/payment/result`,
        customerReference: (order._id as unknown as string).toString(),
      }),
    });

    if (!ekRes.ok) {
      await Order.findByIdAndDelete(order._id);
      const body = await ekRes.text();
      res.status(502).json({ error: 'EasyKash API error', detail: body });
      return;
    }

    const ekData = (await ekRes.json()) as { redirectUrl: string };
    res.json({ redirectUrl: ekData.redirectUrl, orderId: (order._id as unknown as string).toString() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// ─── POST /api/payments/easykash/callback ─────────────────────────────────────
// Server-to-server webhook from EasyKash after a successful payment.
router.post('/callback', async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body as {
      ProductCode: string;
      Amount: string;
      ProductType: string;
      PaymentMethod: string;
      status: string;
      easykashRef: string;
      customerReference: string;
      signatureHash: string;
    };

    const { ProductCode, Amount, ProductType, PaymentMethod, status, easykashRef, customerReference, signatureHash } =
      payload;

    // Verify HMAC-SHA512
    const secret = process.env.EASYKASH_HMAC_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'HMAC secret not configured' });
      return;
    }
    const dataStr = [ProductCode, Amount, ProductType, PaymentMethod, status, easykashRef, customerReference].join('');
    const calculated = crypto.createHmac('sha512', secret).update(dataStr).digest('hex');
    if (calculated !== signatureHash) {
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    if (status !== 'PAID') {
      res.json({ ok: true });
      return;
    }

    // Find order and populate template
    const order = await Order.findById(customerReference).populate<{
      templateId: { _id: unknown; slug: string; name: string };
    }>('templateId', 'slug name');

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.status !== 'pending') {
      // Already processed (duplicate callback)
      res.json({ ok: true });
      return;
    }

    // Hash password before background work
    const hashedPassword = await bcrypt.hash(order.instancePassword, 12);

    // Mark confirmed
    order.status = 'confirmed';
    order.easykashRef = easykashRef;
    await order.save();

    // Respond immediately so EasyKash doesn't retry
    res.json({ ok: true });

    // Deploy in background
    const template = order.templateId as unknown as { _id: unknown; slug: string };
    const templateIdStr = (template._id as unknown as string).toString();

    deployInstanceBackground(template.slug, order.instanceSlug, templateIdStr, hashedPassword, false)
      .then(async ({ instanceId, ok }) => {
        if (ok) {
          await Order.findByIdAndUpdate(order._id, {
            status: 'deployed',
            instanceId: instanceId ?? undefined,
            instancePassword: '',
          });
          console.log(`[easykash] Order ${order._id} deployed → ${order.instanceSlug}.farhty.online`);
        } else {
          console.error(`[easykash] Deploy script failed for order ${order._id} — order stays confirmed, not deployed`);
        }
      })
      .catch((err) => console.error('[easykash] Background deploy failed:', err));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (!res.headersSent) res.status(500).json({ error: msg });
  }
});

// ─── GET /api/payments/easykash/result ───────────────────────────────────────
// Polled by the store's PaymentResult page.
router.get('/result', async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.query.orderId as string;
    if (!orderId) {
      res.status(400).json({ error: 'orderId required' });
      return;
    }

    const order = await Order.findById(orderId).populate<{
      templateId: { name: string };
    }>('templateId', 'name');

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json({
      status: order.status,
      instanceSlug: order.instanceSlug,
      templateName: (order.templateId as unknown as { name: string })?.name ?? '',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

export default router;

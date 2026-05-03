import { Router, Request, Response, IRouter } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Instance } from '../models/Instance';
import { Template } from '../models/Template';
import { adminAuth } from '../middleware/adminAuth';
import { instanceAuth, InstanceRequest } from '../middleware/instanceAuth';
import { deployInstance } from '../services/deploy.service';

const BCRYPT_ROUNDS = 12;

// ─── Customer router ──────────────────────────────────────────────────────────
// Mounted at: /api/instances
export const publicInstanceRouter: IRouter = Router();

// POST /api/instances/auth
publicInstanceRouter.post('/auth', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug, password } = req.body as { slug: string; password: string };

    const instance = await Instance.findOne({ slug });
    if (!instance) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, instance.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'JWT_SECRET not configured' });
      return;
    }

    const token = jwt.sign(
      { instanceId: (instance._id as unknown as string).toString(), slug: instance.slug },
      secret,
      { expiresIn: '30d' }
    );

    res.json({ token });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// GET /api/instances/by-domain — resolves slug from query param or Host header
publicInstanceRouter.get('/by-domain', instanceAuth, async (req: InstanceRequest, res: Response): Promise<void> => {
  try {
    // Prefer explicit slug query param (browsers cannot set Host header)
    // Fall back to Host header for server-side / native clients
    let slug = (req.query.slug as string) || '';
    if (!slug) {
      const host = req.headers.host || '';
      slug = host.split('.')[0];
    }

    const instance = await Instance.findOne({ slug }).populate('templateId');
    if (!instance) {
      res.status(404).json({ error: 'Instance not found for this domain' });
      return;
    }

    const template = instance.templateId as unknown as {
      _id: string;
      fields: unknown[];
      features: unknown;
    };

    res.json({
      instanceId: instance._id,
      templateId: template._id,
      slug: instance.slug,
      isPreview: instance.isPreview,
      features: template.features,
      fields: template.fields,
      data: Object.fromEntries(instance.data),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// PATCH /api/instances/:id/data
publicInstanceRouter.patch('/:id/data', instanceAuth, async (req: InstanceRequest, res: Response): Promise<void> => {
  try {
    const instance = await Instance.findById(req.params.id);
    if (!instance) {
      res.status(404).json({ error: 'Instance not found' });
      return;
    }

    const updates = req.body as Record<string, unknown>;
    for (const [key, value] of Object.entries(updates)) {
      instance.data.set(key, value);
    }
    instance.lastUpdatedAt = new Date();
    await instance.save();

    res.json({ message: 'Data updated', data: Object.fromEntries(instance.data) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// ─── Admin router ─────────────────────────────────────────────────────────────
// Mounted at: /api/admin/instances
export const adminInstanceRouter: IRouter = Router();

// GET /api/admin/instances
adminInstanceRouter.get('/', adminAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const instances = await Instance.find()
      .populate('templateId', 'name slug')
      .sort({ deployedAt: -1 });
    res.json(instances);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// POST /api/admin/instances — create + SSE deploy
adminInstanceRouter.post('/', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { templateId, slug, password, isPreview } = req.body as {
      templateId: string;
      slug: string;
      password: string;
      isPreview: boolean;
    };

    // Validate slug is unique
    const existing = await Instance.findOne({ slug });
    if (existing) {
      res.status(409).json({ error: `Slug "${slug}" is already in use` });
      return;
    }

    const template = await Template.findById(templateId);
    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await deployInstance(res, template.slug, slug, templateId, hashedPassword, isPreview ?? false);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (!res.headersSent) {
      res.status(500).json({ error: msg });
    }
  }
});

// PATCH /api/admin/instances/:id/password
adminInstanceRouter.patch('/:id/password', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body as { password: string };
    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const instance = await Instance.findByIdAndUpdate(
      req.params.id,
      { password: hashed, lastUpdatedAt: new Date() },
      { new: true }
    );
    if (!instance) {
      res.status(404).json({ error: 'Instance not found' });
      return;
    }
    res.json({ message: 'Password updated' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// DELETE /api/admin/instances/:id
adminInstanceRouter.delete('/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const instance = await Instance.findByIdAndDelete(req.params.id);
    if (!instance) {
      res.status(404).json({ error: 'Instance not found' });
      return;
    }
    res.json({ message: 'Instance deleted' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

export default publicInstanceRouter;

import { Router, Request, Response, IRouter } from 'express';
import { Order } from '../models/Order';
import { adminAuth } from '../middleware/adminAuth';

// Mounted at: /api/admin/orders
const router: IRouter = Router();

// GET /api/admin/orders
router.get('/', adminAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('templateId', 'name slug price')
      .populate('instanceId', 'slug')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// POST /api/admin/orders (also called from store without auth)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: msg });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch('/:id/status', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body as { status: 'pending' | 'confirmed' | 'deployed' };
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: msg });
  }
});

export default router;

import { Router, Request, Response, IRouter } from 'express';
import { Promo } from '../models/Promo';
import { adminAuth } from '../middleware/adminAuth';

// ─── Public router ────────────────────────────────────────────────────────────
// Mounted at: /api/promos
export const publicPromoRouter: IRouter = Router();

publicPromoRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const promos = await Promo.find({
      isActive: true,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: now } }],
    }).sort({ order: 1, createdAt: -1 });
    res.json(promos);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// ─── Admin router ─────────────────────────────────────────────────────────────
// Mounted at: /api/admin/promos
export const adminPromoRouter: IRouter = Router();

adminPromoRouter.get('/', adminAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const promos = await Promo.find().sort({ order: 1, createdAt: -1 });
    res.json(promos);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

adminPromoRouter.post('/', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const promo = await Promo.create(req.body);
    res.status(201).json(promo);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: msg });
  }
});

adminPromoRouter.put('/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const promo = await Promo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!promo) { res.status(404).json({ error: 'Promo not found' }); return; }
    res.json(promo);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: msg });
  }
});

adminPromoRouter.patch('/:id/status', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { isActive } = req.body as { isActive: boolean };
    const promo = await Promo.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!promo) { res.status(404).json({ error: 'Promo not found' }); return; }
    res.json(promo);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: msg });
  }
});

adminPromoRouter.delete('/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);
    if (!promo) { res.status(404).json({ error: 'Promo not found' }); return; }
    res.json({ message: 'Deleted' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

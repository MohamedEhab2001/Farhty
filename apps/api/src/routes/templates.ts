import { Router, Request, Response, IRouter } from 'express';
import { Template } from '../models/Template';
import { adminAuth } from '../middleware/adminAuth';

// ─── Public router ────────────────────────────────────────────────────────────
// Mounted at: /api/templates
export const publicTemplateRouter: IRouter = Router();

// GET /api/templates  — list active templates
publicTemplateRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const templates = await Template.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// GET /api/templates/:slug  — single template
publicTemplateRouter.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const template = await Template.findOne({ slug: req.params.slug });
    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.json(template);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// ─── Admin router ─────────────────────────────────────────────────────────────
// Mounted at: /api/admin/templates
export const adminTemplateRouter: IRouter = Router();

// GET /api/admin/templates — list ALL templates
adminTemplateRouter.get('/', adminAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// POST /api/admin/templates
adminTemplateRouter.post('/', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const template = await Template.create(req.body);
    res.status(201).json(template);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: msg });
  }
});

// PUT /api/admin/templates/:id
adminTemplateRouter.put('/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.json(template);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: msg });
  }
});

// PATCH /api/admin/templates/:id/status
adminTemplateRouter.patch('/:id/status', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body as { status: 'draft' | 'active' };
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.json(template);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: msg });
  }
});

// DELETE /api/admin/templates/:id
adminTemplateRouter.delete('/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.json({ message: 'Template deleted' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// Default export for backward compat (not used directly anymore)
export default publicTemplateRouter;

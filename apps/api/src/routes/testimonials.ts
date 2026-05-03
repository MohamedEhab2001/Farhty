import { Router, Request, Response, IRouter } from 'express';
import { Testimonial } from '../models/Testimonial';
import { adminAuth } from '../middleware/adminAuth';

// ─── Public router ────────────────────────────────────────────────────────────
// Mounted at: /api/testimonials
export const publicTestimonialRouter: IRouter = Router();

publicTestimonialRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// ─── Admin router ─────────────────────────────────────────────────────────────
// Mounted at: /api/admin/testimonials
export const adminTestimonialRouter: IRouter = Router();

adminTestimonialRouter.post('/', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: msg });
  }
});

adminTestimonialRouter.put('/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }
    res.json(testimonial);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: msg });
  }
});

adminTestimonialRouter.delete('/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

export default publicTestimonialRouter;

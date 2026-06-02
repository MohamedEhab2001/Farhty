import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('ERROR: Missing Cloudinary env vars. Check .env file.');
  process.exit(1);
}

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';

// Auth
import authRoutes from './routes/auth';

// Templates
import { publicTemplateRouter, adminTemplateRouter } from './routes/templates';

// Instances
import { publicInstanceRouter, adminInstanceRouter } from './routes/instances';

// Orders (admin-only)
import orderRoutes from './routes/orders';

// Testimonials
import { publicTestimonialRouter, adminTestimonialRouter } from './routes/testimonials';

// Promos
import { publicPromoRouter, adminPromoRouter } from './routes/promos';

// EasyKash payments
import easykashRoutes from './routes/easykash';

// Upload
import uploadRoutes from './routes/upload';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Public routes ────────────────────────────────────────────────────────────
app.use('/api/templates', publicTemplateRouter);
app.use('/api/instances', publicInstanceRouter);
app.use('/api/testimonials', publicTestimonialRouter);
app.use('/api/promos', publicPromoRouter);

// ─── Admin routes ─────────────────────────────────────────────────────────────
app.use('/api/admin/templates', adminTemplateRouter);
app.use('/api/admin/instances', adminInstanceRouter);
app.use('/api/admin/orders', orderRoutes);
app.use('/api/admin/testimonials', adminTestimonialRouter);
app.use('/api/admin/promos', adminPromoRouter);

// ─── EasyKash ─────────────────────────────────────────────────────────────────
app.use('/api/payments/easykash', easykashRoutes);

// ─── Upload ───────────────────────────────────────────────────────────────────
app.use('/api/upload', uploadRoutes);

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Farhty API running on port ${PORT}`);
  });
});

import mongoose, { Document, Schema } from 'mongoose';

export interface IPromo extends Document {
  type: 'banner' | 'popup';
  title: string;
  subtitle?: string;
  badge?: string;
  ctaLabel: string;
  ctaLink?: string;
  imageUrl?: string;
  theme: 'purple' | 'gold' | 'rose' | 'dark';
  isActive: boolean;
  order: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PromoSchema = new Schema<IPromo>(
  {
    type: { type: String, enum: ['banner', 'popup'], required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    badge: { type: String },
    ctaLabel: { type: String, required: true, default: 'اطلب الآن' },
    ctaLink: { type: String, default: '#templates' },
    imageUrl: { type: String },
    theme: { type: String, enum: ['purple', 'gold', 'rose', 'dark'], default: 'purple' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export const Promo = mongoose.model<IPromo>('Promo', PromoSchema);

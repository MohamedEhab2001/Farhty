import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplateField {
  key: string;
  label: string;
  type: 'text' | 'image' | 'audio' | 'date' | 'color' | 'boolean';
  defaultValue: unknown;
  cloudinaryFolder: string;
  required: boolean;
}

export interface ITemplateFeatures {
  music: boolean;
  gallery: boolean;
  rsvp: boolean;
  countdownTimer: boolean;
  rtl: boolean;
  pages: number;
}

export interface ITemplate extends Document {
  name: string;
  slug: string;
  price: number;
  description: string;
  language: 'ar' | 'en' | 'both';
  features: ITemplateFeatures;
  fields: ITemplateField[];
  previewImages: string[];
  previewVideo?: string;
  status: 'draft' | 'active';
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateFieldSchema = new Schema<ITemplateField>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'image', 'audio', 'date', 'color', 'boolean'],
      required: true,
    },
    defaultValue: { type: Schema.Types.Mixed },
    cloudinaryFolder: { type: String, default: '' },
    required: { type: Boolean, default: false },
  },
  { _id: false }
);

const TemplateFeaturesSchema = new Schema<ITemplateFeatures>(
  {
    music: { type: Boolean, default: false },
    gallery: { type: Boolean, default: false },
    rsvp: { type: Boolean, default: false },
    countdownTimer: { type: Boolean, default: false },
    rtl: { type: Boolean, default: true },
    pages: { type: Number, default: 1 },
  },
  { _id: false }
);

const TemplateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    language: {
      type: String,
      enum: ['ar', 'en', 'both'],
      default: 'ar',
    },
    features: { type: TemplateFeaturesSchema, default: () => ({}) },
    fields: { type: [TemplateFieldSchema], default: [] },
    previewImages: { type: [String], default: [] },
    previewVideo: { type: String },
    status: {
      type: String,
      enum: ['draft', 'active'],
      default: 'draft',
    },
    version: { type: String, default: '1.0.0' },
  },
  { timestamps: true }
);

export const Template = mongoose.model<ITemplate>('Template', TemplateSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplateField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'url' | 'iframe' | 'select' | 'time' | 'image' | 'audio' | 'date' | 'color' | 'boolean' | 'json' | 'array';
  defaultValue: unknown;
  cloudinaryFolder: string;
  required: boolean;
  group: string;
  placeholder: string;
  hint: string;
  options: { label: string; value: string }[];
  itemSchema: { key: string; label: string; type: string; placeholder?: string }[];
  min: number | null;
  max: number | null;
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
  salePrice?: number;
  saleEndsAt?: Date;
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
      enum: ['text', 'textarea', 'number', 'url', 'iframe', 'select', 'time', 'image', 'audio', 'date', 'color', 'boolean', 'json', 'array'],
      required: true,
    },
    defaultValue: { type: Schema.Types.Mixed },
    cloudinaryFolder: { type: String, default: '' },
    required: { type: Boolean, default: false },
    group: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    hint: { type: String, default: '' },
    options: {
      type: [new Schema({ label: String, value: String }, { _id: false })],
      default: [],
    },
    itemSchema: {
      type: [new Schema({ key: String, label: String, type: { type: String }, placeholder: String }, { _id: false })],
      default: [],
    },
    min: { type: Number, default: null },
    max: { type: Number, default: null },
  },
  { _id: false }
);

const TemplateFeaturesSchema = new Schema(
  {
    music: { type: Boolean, default: false },
    gallery: { type: Boolean, default: false },
    rsvp: { type: Boolean, default: false },
    countdownTimer: { type: Boolean, default: false },
    rtl: { type: Boolean, default: true },
    pages: { type: Number, default: 1 },
  },
  { _id: false, strict: false }
);

const TemplateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    saleEndsAt: { type: Date },
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

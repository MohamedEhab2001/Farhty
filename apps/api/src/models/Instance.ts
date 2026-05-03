import mongoose, { Document, Schema } from 'mongoose';

export interface IInstance extends Document {
  templateId: mongoose.Types.ObjectId;
  slug: string;
  password: string;
  isPreview: boolean;
  data: Map<string, unknown>;
  deployedAt: Date;
  lastUpdatedAt: Date;
}

const InstanceSchema = new Schema<IInstance>(
  {
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    slug: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPreview: { type: Boolean, default: false },
    data: {
      type: Map,
      of: Schema.Types.Mixed,
      default: () => new Map(),
    },
    deployedAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const Instance = mongoose.model<IInstance>('Instance', InstanceSchema);

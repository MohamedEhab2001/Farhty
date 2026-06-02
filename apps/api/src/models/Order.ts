import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  templateId: mongoose.Types.ObjectId;
  instanceId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  instanceSlug: string;
  instancePassword: string; // plain-text, cleared after deploy
  easykashRef: string;
  paymentMethod: 'vodafone' | 'instapay' | 'easykash';
  status: 'pending' | 'confirmed' | 'deployed';
  notes: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    instanceId: {
      type: Schema.Types.ObjectId,
      ref: 'Instance',
    },
    customerName: { type: String, default: '' },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    instanceSlug: { type: String, default: '' },
    instancePassword: { type: String, default: '' },
    easykashRef: { type: String, default: '' },
    paymentMethod: {
      type: String,
      enum: ['vodafone', 'instapay', 'easykash'],
      default: 'vodafone',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'deployed'],
      default: 'pending',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);

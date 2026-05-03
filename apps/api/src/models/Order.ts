import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  templateId: mongoose.Types.ObjectId;
  instanceId?: mongoose.Types.ObjectId;
  customerPhone: string;
  paymentMethod: 'vodafone' | 'instapay';
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
    customerPhone: { type: String, default: '' },
    paymentMethod: {
      type: String,
      enum: ['vodafone', 'instapay'],
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

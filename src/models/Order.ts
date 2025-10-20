import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: string;
  vendorId: string;
  items: { menuItemId: string; quantity: number }[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled';
  orderType: 'instant' | 'scheduled' | 'reservation';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    items: [
      {
        menuItemId: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    orderType: { type: String, enum: ['instant', 'scheduled', 'reservation'], default: 'instant' },
  },
  { timestamps: true }
);

// ✅ Safe export
const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default OrderModel;

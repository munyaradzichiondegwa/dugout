import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  items: any[]; // Snapshot of cart items
  totalAmount: number; // Cents
  currency: 'ZWL' | 'USD';
  status: 'pending' | 'accepted' | 'picking' | 'packed' | 'fulfilled' | 'cancelled';
  orderType: 'instant' | 'scheduled' | 'reservation'; // Updated enum
  transactionRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    items: [{ type: Schema.Types.Mixed, required: true }], // Cart snapshot
    totalAmount: { type: Number, required: true },
    currency: { type: String, enum: ['ZWL', 'USD'], required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'picking', 'packed', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
    orderType: {
      type: String,
      enum: ['instant', 'scheduled', 'reservation'], // Updated
      default: 'instant',
    },
    transactionRef: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

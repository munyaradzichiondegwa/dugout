import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  menuItemId: mongoose.Types.ObjectId;
  quantity: number;
  specialInstructions?: string;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number; // Cents
  currency: 'ZWL' | 'USD';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
  menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  specialInstructions: { type: String },
});

const CartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [CartItemSchema],
  totalAmount: { type: Number, required: true }, // Calculated
  currency: { type: String, enum: ['ZWL', 'USD'], required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

// Cleanup abandoned carts (run via cron)
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
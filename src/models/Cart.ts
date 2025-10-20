import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICartItem {
  menuItemId: Types.ObjectId;
  quantity: number;
  specialInstructions?: string;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  vendorId: Types.ObjectId;
  items: ICartItem[];
  totalAmount: number; // in cents
  currency: 'ZWL' | 'USD';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema<ICartItem> = new Schema({
  menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  specialInstructions: { type: String },
});

const CartSchema: Schema<ICart> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    items: { type: [CartItemSchema], default: [] },
    totalAmount: { type: Number, required: true },
    currency: { type: String, enum: ['ZWL', 'USD'], required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Auto-expire carts after `expiresAt`
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ✅ Safe export to avoid model overwrite errors
const CartModel = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
export default CartModel;

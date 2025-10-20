import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMenuItem extends Document {
  vendorId: Types.ObjectId;
  name: string;
  category: string; // e.g., 'Main Course', 'Beer', 'Fresh Produce'
  itemType: 'food' | 'beverage' | 'grocery';
  price: number; // In cents
  currency: 'ZWL' | 'USD';
  image?: string;
  unit?: string; // For groceries: 'kg', 'litre', etc.
  stockQuantity?: number; // For groceries
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema: Schema<IMenuItem> = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    itemType: { type: String, enum: ['food', 'beverage', 'grocery'], required: true },
    price: { type: Number, required: true }, // In cents
    currency: { type: String, enum: ['ZWL', 'USD'], default: 'USD' },
    image: { type: String },
    unit: { type: String },
    stockQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Safe export to prevent duplicate model errors
const MenuItemModel = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
export default MenuItemModel;

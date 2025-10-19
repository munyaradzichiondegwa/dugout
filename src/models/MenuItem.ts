import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  vendorId: mongoose.Types.ObjectId;
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

const MenuItemSchema: Schema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  itemType: { type: String, enum: ['food', 'beverage', 'grocery'], required: true },
  price: { type: Number, required: true }, // Cents
  currency: { type: String, enum: ['ZWL', 'USD'], default: 'USD' },
  image: { type: String },
  unit: { type: String }, // Optional for non-groceries
  stockQuantity: { type: Number, default: 0 }, // For inventory
}, { timestamps: true });

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
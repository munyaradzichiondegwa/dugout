import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  password?: string; // Hashed for vendors/admins
  role: 'customer' | 'vendor' | 'admin';
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  phone: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for customers (OTP-based)
  role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  password?: string; // hashed
  role: 'customer' | 'vendor' | 'admin';
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    phone: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['customer', 'vendor', 'admin'], required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Safe export
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default UserModel;

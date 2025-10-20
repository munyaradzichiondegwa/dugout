import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  description?: string;
  phone: string;
  address: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  category?: string;
  image?: string;
  verified?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected'; // added for admin use
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema: Schema<IVendor> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    category: { type: String },
    image: { type: String },
    verified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Add 2dsphere index for location queries
VendorSchema.index({ location: '2dsphere' });

// ✅ Ensure mongoose.models is always defined before access
const VendorModel: Model<IVendor> =
  (mongoose.models && mongoose.models.Vendor as Model<IVendor>) ||
  mongoose.model<IVendor>('Vendor', VendorSchema);

export default VendorModel;

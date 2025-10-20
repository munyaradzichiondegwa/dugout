import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  vendorType: string;
  payoutMethod: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}

const VendorSchema = new Schema<IVendor>({
  name: { type: String, required: true },
  vendorType: { type: String, required: true },
  payoutMethod: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
}, { timestamps: true });

// Create 2dsphere index for geo queries
VendorSchema.index({ location: '2dsphere' });

// Prevent model overwrite on hot reload
const VendorModel: Model<IVendor> = mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);

export default VendorModel;

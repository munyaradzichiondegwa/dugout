import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  vendorType: 'food' | 'beverage' | 'grocery';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat] GeoJSON
  };
  verified: boolean;
  payoutMethod: string; // e.g., 'EcoCash'
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  vendorType: { type: String, enum: ['food', 'beverage', 'grocery'], required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  verified: { type: Boolean, default: false },
  payoutMethod: { type: String, required: true },
}, { timestamps: true });

// Geospatial index
VendorSchema.index({ location: '2dsphere' });

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);
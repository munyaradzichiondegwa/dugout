import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number; // Cents
  currency: 'ZWL' | 'USD';
  pendingHold: number;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, enum: ['ZWL', 'USD'], required: true },
  pendingHold: { type: Number, default: 0 },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);
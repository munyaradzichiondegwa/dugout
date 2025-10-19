import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'credit' | 'debit';
  method: 'EcoCash' | 'OneMoney' | 'Telecash' | 'ZIPIT' | 'Voucher' | 'Mock' | 'Manual';
  reference: string;
  amount: number; // Cents
  currency: 'ZWL' | 'USD';
  status: 'pending' | 'success' | 'failed' | 'reconciled';
  orderId?: mongoose.Types.ObjectId;
  metadata?: any;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  method: { 
    type: String, 
    enum: ['EcoCash', 'OneMoney', 'Telecash', 'ZIPIT', 'Voucher', 'Mock', 'Manual'],
    required: true 
  },
  reference: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['ZWL', 'USD'], required: true },
  status: { type: String, enum: ['pending', 'success', 'failed', 'reconciled'], default: 'pending' },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
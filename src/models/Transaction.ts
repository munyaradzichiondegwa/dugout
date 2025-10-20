import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: 'credit' | 'debit';
  method: 'EcoCash' | 'OneMoney' | 'Telecash' | 'ZIPIT' | 'Voucher' | 'Mock' | 'Manual';
  reference: string;
  amount: number; // In cents
  currency: 'ZWL' | 'USD';
  status: 'pending' | 'success' | 'failed' | 'reconciled';
  orderId?: Types.ObjectId;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    method: {
      type: String,
      enum: ['EcoCash', 'OneMoney', 'Telecash', 'ZIPIT', 'Voucher', 'Mock', 'Manual'],
      required: true,
    },
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['ZWL', 'USD'], required: true },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'reconciled'],
      default: 'pending',
    },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// ✅ Safe export to prevent duplicate model errors
const TransactionModel = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default TransactionModel;

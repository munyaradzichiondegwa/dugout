import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db'; // ✅ fixed
import Wallet from '@/models/Wallet';
import Transaction from '@/models/Transaction';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();
  const user = getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const wallet = await Wallet.findOne({ userId: user.userId });
  return NextResponse.json(wallet || { balance: 0, pendingHold: 0, currency: 'USD' });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { amount, currency = 'USD', method = 'Mock' } = await req.json();

  const wallet = await Wallet.findOneAndUpdate(
    { userId: user.userId },
    { $inc: { balance: amount }, $set: { currency } },
    { upsert: true, new: true }
  );

  const transRef = `CRED_${Date.now()}`;
  const transaction = new Transaction({
    userId: user.userId,
    type: 'credit',
    method,
    reference: transRef,
    amount,
    currency,
    status: 'success',
  });

  await transaction.save();

  return NextResponse.json(wallet);
}

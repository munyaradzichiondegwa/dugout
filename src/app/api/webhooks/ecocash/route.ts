import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Transaction from '@/models/Transaction';
import Wallet from '@/models/Wallet';

export async function POST(req: NextRequest) {
  await dbConnect();
  const payload = await req.json(); // Mock: { reference: 'TXN_123', status: 'success', amount: 1000 }

  const { reference, status, amount } = payload;
  if (!reference) return NextResponse.json({ error: 'Missing reference' }, { status: 400 });

  const transaction = await Transaction.findOne({ reference });
  if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

  if (status === 'success') {
    // Confirm credit
    transaction.status = 'success';
    await transaction.save();

    const wallet = await Wallet.findOne({ userId: transaction.userId });
    if (wallet) {
      wallet.balance += amount; // Atomic in prod with session
      await wallet.save();
    }

    console.log(`EcoCash webhook: Credited ${amount} to wallet for ${reference}`);
  } else {
    transaction.status = 'failed';
    await transaction.save();
  }

  return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
}

// GET for verification (e.g., EcoCash pings)
export async function GET() {
  return NextResponse.json({ message: 'EcoCash webhook ready' });
}
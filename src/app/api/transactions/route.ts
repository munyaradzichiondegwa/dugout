import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Transaction from '@/models/Transaction';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();
  const user = getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const transactions = await Transaction.find({ userId: user.userId }).sort({ createdAt: -1 });
  return NextResponse.json(transactions);
}
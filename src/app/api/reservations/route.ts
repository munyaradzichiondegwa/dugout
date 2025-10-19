import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/models/Order'; // Reuse Order model for reservations
import Wallet from '@/models/Wallet';
import Transaction from '@/models/Transaction';
import { getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  await dbConnect();
  session.startTransaction();
  try {
    const user = getAuthUser();
    if (!user) throw new Error('Unauthorized');

    const { vendorId, durationMinutes = 60 } = await req.json(); // e.g., table for 1 hour
    const holdAmount = 100; // Fixed hold for reservation, e.g., $1.00 USD

    const wallet = await Wallet.findOne({ userId: user.userId });
    if (!wallet || wallet.balance < holdAmount + wallet.pendingHold) throw new Error('Insufficient balance');

    // Atomic hold
    wallet.pendingHold += holdAmount;
    await wallet.save({ session });

    const transRef = `RES_${Date.now()}`;
    const transaction = new Transaction({
      userId: user.userId,
      type: 'debit',
      method: 'Wallet',
      reference: transRef,
      amount: holdAmount,
      currency: 'USD',
      status: 'pending',
    });
    await transaction.save({ session });

    // Create reservation as order
    const reservation = new Order({
      userId: user.userId,
      vendorId,
      items: [], // No items for reservation
      totalAmount: holdAmount,
      currency: 'USD',
      orderType: 'reservation',
      transactionRef: transRef,
      status: 'pending', // Vendor confirms
    });
    await reservation.save({ session });

    transaction.orderId = reservation._id;
    await transaction.save({ session });

    await session.commitTransaction();
    console.log(`Reservation ${reservation._id} created for vendor ${vendorId}. Notify: "Table booked for ${durationMinutes} mins!"`);
    return NextResponse.json(reservation);
  } catch (error) {
    await session.abortTransaction();
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  } finally {
    session.endSession();
  }
}
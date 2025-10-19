import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
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

    const { vendorId, orderType = 'instant' } = await req.json();
    const cart = await Cart.findOne({ userId: user.userId, vendorId }).populate('items.menuItemId');
    if (!cart || cart.items.length === 0) throw new Error('No cart');

    const wallet = await Wallet.findOne({ userId: user.userId });
    if (!wallet || wallet.balance < cart.totalAmount + wallet.pendingHold) throw new Error('Insufficient balance');

    // Atomic hold
    wallet.pendingHold += cart.totalAmount;
    await wallet.save();

    // Create transaction (pending debit)
    const transRef = `TXN_${Date.now()}`;
    const transaction = new Transaction({
      userId: user.userId,
      type: 'debit',
      method: 'Wallet',
      reference: transRef,
      amount: cart.totalAmount,
      currency: cart.currency,
      status: 'pending',
      orderId: null, // Will update after order
    });
    await transaction.save();

    // Create order with cart snapshot
    const order = new Order({
      userId: user.userId,
      vendorId,
      items: cart.items, // Snapshot
      totalAmount: cart.totalAmount,
      currency: cart.currency,
      orderType,
      transactionRef: transRef,
    });
    await order.save();

    // Link transaction to order
    transaction.orderId = order._id;
    await transaction.save();

    // Clear cart
    await Cart.deleteOne({ _id: cart._id });

    await session.commitTransaction();
    return NextResponse.json(order);
  } catch (error) {
    await session.abortTransaction();
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  } finally {
    session.endSession();
  }
}

// GET for user orders, PUT for status updates (e.g., vendor accepts)
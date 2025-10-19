import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/models/Order';
import MenuItem from '@/models/MenuItem';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = getAuthUser();
  if (!user || user.role !== 'vendor' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { params } = req; // In Next.js App Router, use params from dynamic route
  const orderId = params.id; // Assume [id] is the param

  const order = await Order.findById(orderId).populate('items.menuItemId'); // Wait, items is snapshot, but use original IDs
  if (!order || order.status !== 'accepted') {
    return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
  }

  // Decrement inventory for grocery items (or all with stock)
  for (const item of order.items) {
    if (item.menuItemId && item.menuItemId.stockQuantity !== undefined) {
      await MenuItem.findByIdAndUpdate(
        item.menuItemId._id,
        { $inc: { stockQuantity: -item.quantity } }
      );
    }
  }

  // Update order status
  order.status = 'fulfilled';
  await order.save();

  // Finalize debit from hold (reduce balance and pendingHold)
  // Assume wallet update here (similar to transaction logic)

  return NextResponse.json({ message: 'Order fulfilled, inventory updated' });
}
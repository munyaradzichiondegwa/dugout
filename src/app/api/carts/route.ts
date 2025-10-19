import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Cart from '@/models/Cart';
import MenuItem from '@/models/MenuItem';
import { getAuthUser } from '@/lib/auth';
import { calculateCartTotal } from '@/lib/utils';

export async function GET(req: NextRequest) {
  await dbConnect();
  const user = getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const vendorId = searchParams.get('vendorId');
  const cart = await Cart.findOne({ userId: user.userId, vendorId }).populate('items.menuItemId');
  return NextResponse.json(cart || { items: [], totalAmount: 0 });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { vendorId, items, currency = 'USD' } = await req.json();
  const menuItems = await MenuItem.find({ _id: { $in: items.map((i: any) => i.menuItemId) } });
  const totalAmount = calculateCartTotal(items, menuItems);

  // Cleanup old cart
  await Cart.deleteOne({ userId: user.userId, vendorId });

  const cart = new Cart({
    userId: user.userId,
    vendorId,
    items,
    totalAmount,
    currency,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });
  await cart.save();
  return NextResponse.json(cart);
}

// PUT for update, DELETE for clear
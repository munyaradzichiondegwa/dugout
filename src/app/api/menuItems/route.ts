import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const vendorId = searchParams.get('vendorId');

  const filter = vendorId ? { vendorId } : {};
  const items = await MenuItem.find(filter);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = await getAuthUser(req);
  if (!user || user.role !== 'vendor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();

  // Ensure user.vendorId exists and is of type ObjectId
  if (user.vendorId) {
    data.vendorId = new mongoose.Types.ObjectId(user.vendorId);
  } else {
    return NextResponse.json({ error: 'Vendor ID missing' }, { status: 400 });
  }

  const item = new MenuItem(data);
  await item.save();

  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const user = await getAuthUser(req);
  if (!user || user.role !== 'vendor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  if (!data._id) {
    return NextResponse.json({ error: 'MenuItem ID is required' }, { status: 400 });
  }

  // Ensure vendor can only update their own items
  const filter = { _id: data._id, vendorId: user.vendorId };

  const updatedItem = await MenuItem.findOneAndUpdate(filter, data, { new: true });
  if (!updatedItem) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json(updatedItem);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const user = await getAuthUser(req);
  if (!user || user.role !== 'vendor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'MenuItem ID is required' }, { status: 400 });
  }

  const deleted = await MenuItem.findOneAndDelete({ _id: id, vendorId: user.vendorId });
  if (!deleted) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Item deleted successfully' });
}
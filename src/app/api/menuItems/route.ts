import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const vendorId = searchParams.get('vendorId');

  const items = await MenuItem.find(vendorId ? { vendorId } : {});
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = await getAuthUser(req); // make sure this receives the request
  if (!user || user.role !== 'vendor') 
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  data.vendorId = new mongoose.Types.ObjectId(user.vendorId); // assume user has vendorId
  const item = new MenuItem(data);
  await item.save();
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const user = await getAuthUser(req);
  if (!user || user.role !== 'vendor') 
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  if (!data._id) 
    return NextResponse.json({ error: 'MenuItem ID is required' }, { status: 400 });

  const updatedItem = await MenuItem.findOneAndUpdate(
    { _id: data._id, vendorId: user.vendorId }, // ensure vendor can only update own items
    data,
    { new: true }
  );

  if (!updatedItem) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  return NextResponse.json(updatedItem);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const user = await getAuthUser(req);
  if (!user || user.role !== 'vendor') 
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'MenuItem ID is required' }, { status: 400 });

  const deleted = await MenuItem.findOneAndDelete({ _id: id, vendorId: user.vendorId });
  if (!deleted) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  return NextResponse.json({ message: 'Item deleted successfully' });
}

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();
  const user = getAuthUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin only' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const verified = searchParams.get('verified') === 'false'; // Unverified by default

  const vendors = await Vendor.find({ verified: verified ? false : { $ne: false } }).populate('userId');
  return NextResponse.json(vendors);
}

export async function POST(req: NextRequest) { // Verify specific vendor (use [id]/verify for single)
  await dbConnect();
  const user = getAuthUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { vendorId } = await req.json();
  await Vendor.findByIdAndUpdate(vendorId, { verified: true });
  return NextResponse.json({ message: 'Verified' });
}
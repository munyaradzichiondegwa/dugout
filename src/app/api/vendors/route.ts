import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const vendors = await Vendor.find({}); // You can add filters like vendorType if needed
    return NextResponse.json(vendors);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch vendors', details: err }, { status: 500 });
  }
}

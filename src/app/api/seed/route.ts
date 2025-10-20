import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import { vendorsData } from './data';

export async function GET() {
  try {
    await dbConnect();

    // Optional: clear old vendors if you want fresh seeding
    await Vendor.deleteMany({});

    // Insert all vendors
    await Vendor.insertMany(vendorsData);

    return NextResponse.json({ message: 'Vendors seeded successfully', count: vendorsData.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Seeding failed', details: err }, { status: 500 });
  }
}

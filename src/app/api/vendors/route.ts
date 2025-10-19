import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db';
import Vendor from '@/models/Vendor';
import User from '@/models/User'; // Needed for populate
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // optional filter
    const lng = searchParams.get('lng');
    const lat = searchParams.get('lat');
    const maxDistance = parseInt(searchParams.get('maxDistance') || '5000', 10);

    let query: any = { verified: true };
    if (type) query.vendorType = type;

    if (lng && lat) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: maxDistance,
        },
      };
    }

    const vendors = await Vendor.find(query).populate('userId').lean();
    // Always return an array, even if empty
    return NextResponse.json(Array.isArray(vendors) ? vendors : []);
  } catch (err) {
    console.error('Error fetching vendors:', err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const user = getAuthUser();
    if (!user || user.role !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, vendorType, location, payoutMethod } = body;

    if (!location?.coordinates || !Array.isArray(location.coordinates)) {
      return NextResponse.json({ error: 'Invalid location' }, { status: 400 });
    }

    const vendor = new Vendor({
      userId: new mongoose.Types.ObjectId(user.userId),
      name,
      vendorType,
      location: { type: 'Point', coordinates: location.coordinates },
      payoutMethod,
      verified: false,
    });

    await vendor.save();
    return NextResponse.json(vendor);
  } catch (err) {
    console.error('Error creating vendor:', err);
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import VendorModel, { IVendor } from '@/models/Vendor';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const vendors = await VendorModel.find();
    return NextResponse.json(vendors, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    const { vendorId, action } = await req.json();

    const vendor = await VendorModel.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    switch (action) {
      case 'verify':
        // Add verificationStatus property to type
        (vendor as IVendor & { verificationStatus?: string }).verificationStatus = 'verified';
        vendor.verified = true; // backward-compatible
        break;
      case 'reject':
        (vendor as IVendor & { verificationStatus?: string }).verificationStatus = 'rejected';
        vendor.verified = false;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await vendor.save();
    return NextResponse.json(vendor, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}

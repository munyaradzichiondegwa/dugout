import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { getAuthUser } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const user = getAuthUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin only' }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json().catch(() => ({}));
  const action = body.action || 'verify'; // default to 'verify' if not provided

  const vendor = await Vendor.findById(id);
  if (!vendor) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
  }

  // 🧩 Handle admin action
  switch (action) {
    case 'verify':
      vendor.verified = true;
      vendor.verificationStatus = 'verified';
      break;

    case 'reject':
      vendor.verified = false;
      vendor.verificationStatus = 'rejected';
      break;

    case 'suspend':
      vendor.verified = false;
      vendor.verificationStatus = 'suspended';
      break;

    default:
      return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
  }

  await vendor.save();

  return NextResponse.json({
    message: `Vendor ${action}ed successfully`,
    vendor,
  });
}

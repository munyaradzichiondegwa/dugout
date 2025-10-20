import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { getAuthUser } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const user = await getAuthUser();

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin only' }, { status: 401 });
  }

  const { id } = params;

  // Verify vendor exists
  const vendor = await Vendor.findById(id);
  if (!vendor) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
  }

  const { action } = await req.json();
  if (!action || !['verify', 'reject', 'suspend'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  // Update vendor status based on action
  switch (action) {
    case 'verify':
      vendor.verificationStatus = 'verified';
      vendor.verified = true; // backward-compatible if schema still uses `verified`
      break;
    case 'reject':
      vendor.verificationStatus = 'rejected';
      vendor.verified = false;
      break;
    case 'suspend':
      vendor.verificationStatus = 'suspended';
      vendor.verified = false;
      break;
  }

  await vendor.save();

  return NextResponse.json({ message: `Vendor ${action}d successfully`, vendor });
}

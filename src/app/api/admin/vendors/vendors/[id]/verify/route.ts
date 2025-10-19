import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Vendor from '@/models/Vendor';
import { getAuthUser } from '@/lib/auth';
import { useParams } from 'next/navigation'; // Note: For API, use req.url

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = getAuthUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // Or parse from path if using dynamic

  await Vendor.findByIdAndUpdate(id, { verified: true });
  return NextResponse.json({ message: 'Vendor verified' });
}
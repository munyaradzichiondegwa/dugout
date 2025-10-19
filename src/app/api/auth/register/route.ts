import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { phone, password, role = 'customer' } = await req.json();

  // Mock OTP verification (assume verified)
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return NextResponse.json({ error: 'User exists' }, { status: 400 });
  }

  const hashedPassword = role !== 'customer' ? await hashPassword(password) : undefined;
  const user = new User({ phone, password: hashedPassword, role });
  await user.save();

  const token = generateToken({ userId: user._id.toString(), role: user.role, phone });
  const response = NextResponse.json({ message: 'Registered' });
  response.cookies.set('auth-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  return response;
}
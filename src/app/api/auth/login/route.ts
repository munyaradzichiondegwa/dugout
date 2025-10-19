import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import { verifyPassword } from '@/lib/auth';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { phone, password, otp } = await req.json(); // OTP for customers, password for others

  const user = await User.findOne({ phone });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

  // Mock OTP check or password verify
  if (user.role === 'customer') {
    if (otp !== '123456') return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 }); // Mock
  } else {
    const isValid = await verifyPassword(password, user.password!);
    if (!isValid) return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = generateToken({ userId: user._id.toString(), role: user.role, phone });
  const response = NextResponse.json({ message: 'Logged in' });
  response.cookies.set('auth-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  return response;
}
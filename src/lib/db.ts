// src/lib/db.ts
import mongoose from 'mongoose';
import Vendor from '@/models/Vendor';
import Wallet from '@/models/Wallet';
import Order from '@/models/Order';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local');

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null };
}

let cached = global.mongoose || { conn: null, promise: null };

/**
 * Connect to MongoDB (cached in development)
 */
export async function dbConnect(): Promise<mongoose.Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

/* =================== VENDOR HELPERS =================== */

/**
 * Fetch all verified vendors, optionally near a location
 */
export async function fetchVendors(near?: { lat: number; lng: number }) {
  await dbConnect();

  const query: any = { verificationStatus: 'verified' };

  if (near) {
    query.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [near.lng, near.lat] },
        $maxDistance: 10000, // 10km
      },
    };
  }

  return Vendor.find(query).populate('items');
}

/**
 * Fetch a vendor by ID
 */
export async function fetchVendorById(id: string) {
  await dbConnect();
  return Vendor.findById(id).populate('items');
}

/* =================== WALLET HELPERS =================== */

/**
 * Fetch a wallet by user ID
 */
export async function fetchWalletByUserId(userId: string) {
  await dbConnect();
  return Wallet.findOne({ userId });
}

/**
 * Update a wallet balance
 */
export async function updateWalletBalance(
  userId: string,
  update: { USD?: number; ZWL?: number; pendingHold?: number }
) {
  await dbConnect();
  return Wallet.findOneAndUpdate({ userId }, { $inc: update }, { new: true });
}

/* =================== ORDER HELPERS =================== */

/**
 * Fetch orders for a user, optionally filtered by status
 */
export async function fetchOrders(userId: string, status?: string) {
  await dbConnect();

  const query: any = { userId };
  if (status) query.status = status;

  return Order.find(query).populate('items vendor');
}

/**
 * Fetch a single order by ID
 */
export async function fetchOrderById(orderId: string) {
  await dbConnect();
  return Order.findById(orderId).populate('items vendor');
}

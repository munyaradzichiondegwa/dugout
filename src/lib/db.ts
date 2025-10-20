// src/lib/db.ts
import mongoose from 'mongoose';
import Vendor from '@/models/Vendor';
import Wallet from '@/models/Wallet';
import Order from '@/models/Order';

// Ensure MongoDB URI is available
const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local');

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null };
}

let cached = global.mongoose || { conn: null, promise: null };

/* =================== DATABASE CONNECTION =================== */

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

interface VendorFilters {
  verified?: boolean;
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Fetch vendors with optional filters (verification, location, pagination, search)
 */
export async function fetchVendors(filters: VendorFilters = {}) {
  await dbConnect();

  const query: any = {};

  // Verification filter
  if (typeof filters.verified === 'boolean') {
    query.verificationStatus = filters.verified ? 'verified' : 'pending';
  } else {
    query.verificationStatus = 'verified'; // default behavior
  }

  // Text search (e.g., vendor name or type)
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { vendorType: { $regex: filters.search, $options: 'i' } },
    ];
  }

  // Optional geospatial filter
  if (filters.lat && filters.lng) {
    query.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [filters.lng, filters.lat] },
        $maxDistance: 10000, // 10 km
      },
    };
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  return Vendor.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('items');
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

/* =================== ADMIN HELPERS =================== */

/**
 * Fetch recent orders for admin dashboard (last 24 hours)
 */
export async function fetchRecentOrders(limit: number = 10) {
  await dbConnect();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return Order.find({ createdAt: { $gte: oneDayAgo } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId vendorId');
}

import mongoose from 'mongoose';

// ✅ Do NOT import models at the top (they register before connection)
const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local');

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null };
}

// ✅ Use global cache to persist connection across hot reloads
let cached = global._mongooseCache || { conn: null, promise: null };
global._mongooseCache = cached;

/* =================== DATABASE CONNECTION =================== */
export async function dbConnect(): Promise<mongoose.Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

/* =================== DYNAMIC MODEL IMPORTS =================== */
async function getModels() {
  const { default: Vendor } = await import('@/models/Vendor');
  const { default: Wallet } = await import('@/models/Wallet');
  const { default: Order } = await import('@/models/Order');
  return { Vendor, Wallet, Order };
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

/** Fetch vendors with optional filters */
export async function fetchVendors(filters: VendorFilters = {}) {
  await dbConnect();
  const { Vendor } = await getModels();

  const query: any = {};

  // Verification filter
  if (typeof filters.verified === 'boolean') {
    query.verificationStatus = filters.verified ? 'verified' : 'pending';
  } else {
    query.verificationStatus = 'verified'; // default
  }

  // Search
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { category: { $regex: filters.search, $options: 'i' } },
    ];
  }

  // Location filter
  if (filters.lat && filters.lng) {
    query.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [filters.lng, filters.lat] },
        $maxDistance: 10000, // 10km
      },
    };
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  return Vendor.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

/** Fetch a vendor by ID */
export async function fetchVendorById(id: string) {
  await dbConnect();
  const { Vendor } = await getModels();
  return Vendor.findById(id);
}

/* =================== WALLET HELPERS =================== */
export async function fetchWalletByUserId(userId: string) {
  await dbConnect();
  const { Wallet } = await getModels();
  return Wallet.findOne({ userId });
}

export async function updateWalletBalance(
  userId: string,
  update: { USD?: number; ZWL?: number; pendingHold?: number }
) {
  await dbConnect();
  const { Wallet } = await getModels();
  return Wallet.findOneAndUpdate({ userId }, { $inc: update }, { new: true });
}

/* =================== ORDER HELPERS =================== */
export async function fetchOrders(userId: string, status?: string) {
  await dbConnect();
  const { Order } = await getModels();
  const query: any = { userId };
  if (status) query.status = status;
  return Order.find(query).populate('vendorId');
}

export async function fetchOrderById(orderId: string) {
  await dbConnect();
  const { Order } = await getModels();
  return Order.findById(orderId).populate('vendorId');
}

/* =================== ADMIN HELPERS =================== */
export async function fetchRecentOrders(limit: number = 10) {
  await dbConnect();
  const { Order } = await getModels();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return Order.find({ createdAt: { $gte: oneDayAgo } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId vendorId');
}

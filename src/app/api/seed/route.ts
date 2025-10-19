// src/app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Vendor from '@/models/Vendor';
import MenuItem from '@/models/MenuItem';
import { vendorsData } from './data';

export async function GET() {
  try {
    await dbConnect();

    const seededVendors = [];

    for (const v of vendorsData) {
      // 1️⃣ Check or create user
      let user = await User.findOne({ phone: v.phone });
      if (!user) {
        user = new User({ phone: v.phone, role: 'vendor' });
        await user.save();
      }

      // 2️⃣ Check or create vendor
      let vendor = await Vendor.findOne({ userId: user._id });
      if (!vendor) {
        vendor = new Vendor({
          userId: user._id,
          name: v.name,
          vendorType: v.vendorType,
          location: v.location,
          verified: true,
          payoutMethod: v.payoutMethod,
        });
        await vendor.save();
      }

      // 3️⃣ Check or create menu items
      const items = [];
      for (const itemData of v.items) {
        let item = await MenuItem.findOne({ vendorId: vendor._id, name: itemData.name });
        if (!item) {
          item = new MenuItem({ ...itemData, vendorId: vendor._id });
          await item.save();
        }
        items.push(item);
      }

      seededVendors.push({ vendor, items });
    }

    return NextResponse.json({ message: 'Seeded multiple vendors successfully', seededVendors });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

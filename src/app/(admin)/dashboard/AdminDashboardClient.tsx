'use client';

import { useState } from 'react';
import PendingVendorApprovals from '@/components/PendingVendorApprovals';
import Link from 'next/link';

interface Vendor {
  _id: string;
  name: string;
  vendorType: string;
  location: { coordinates: [number, number] };
}

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  currency: string;
}

interface Props {
  vendors: Vendor[];
  recentOrders: Order[];
}

export default function AdminDashboardClient({ vendors, recentOrders }: Props) {
  const [pendingCount, setPendingCount] = useState(vendors.length);

  const handleVendorUpdate = (vendorId: string) => {
    setPendingCount((prev) => prev - 1);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Pending Vendors</h2>
          <p className="text-3xl font-bold">{pendingCount}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <p className="text-3xl font-bold">{recentOrders.length}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Revenue (USD)</h2>
          <p className="text-3xl font-bold">
            $
            {recentOrders.reduce((acc, order) => acc + order.totalAmount / 100, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Vendor Approvals */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Pending Vendor Approvals</h2>
        <PendingVendorApprovals vendors={vendors} onUpdate={handleVendorUpdate} />
      </div>

      {/* Recent Orders */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex justify-between p-3 border-b text-sm"
              >
                <span>
                  Order #{order._id.slice(-6)} - {order.status}
                </span>
                <span>
                  Total: ${(order.totalAmount / 100).toFixed(2)} {order.currency}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <Link
          href="/admin/vendors"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Manage Vendors
        </Link>
        <Link
          href="/admin/payouts"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Batch Payouts
        </Link>
        <Link
          href="/admin/reports"
          className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
        >
          Generate Reports
        </Link>
      </div>
    </div>
  );
}

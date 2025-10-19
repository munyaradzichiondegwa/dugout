// src/app/(admin)/dashboard/page.tsx
import { getServerSession } from 'next-auth'; // Or your JWT auth
import ProtectedRoute from '@/components/ProtectedRoute';

export default async function AdminDashboard() {
  const session = await getServerSession();
  if (session?.user.role !== 'admin') return <div>Access Denied</div>;

  // Fetch data
  const vendors = await fetchVendors({ verified: false }); // Pending verifications
  const orders = await fetchRecentOrders();

  return (
    <ProtectedRoute role="admin">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded shadow">
            <h2>Vendor Approvals</h2>
            {vendors.map(v => (
              <div key={v._id} className="flex justify-between p-2 border-b">
                <span>{v.name} ({v.vendorType})</span>
                <button className="bg-green-500 text-white px-2 py-1 rounded">Verify</button>
              </div>
            ))}
          </div>
          <div className="p-6 bg-white rounded shadow">
            <h2>Recent Orders</h2>
            {orders.map(o => (
              <div key={o._id}>{o.status} - Total: ${o.total / 100}</div>
            ))}
          </div>
        </div>
        <Link href="/admin/payouts" className="bg-blue-500 text-white px-6 py-2 rounded">Batch Payouts</Link>
      </div>
    </ProtectedRoute>
  );
}
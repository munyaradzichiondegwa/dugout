'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch with auth (assume token in cookies/headers)
    fetch('/api/admin/vendors').then(res => {
      if (res.status === 401) router.push('/login'); // Role check handled in API
      return res.json();
    }).then(setVendors);
    fetch('/api/orders').then(res => res.json()).then(setOrders); // Assume /api/orders supports admin view
  }, [router]);

  const verifyVendor = async (vendorId: string) => {
    await fetch(`/api/admin/vendors/${vendorId}/verify`, { method: 'POST' });
    // Refresh list
    const updated = await fetch('/api/admin/vendors').then(res => res.json());
    setVendors(updated);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-8">
        <h2>Vendor Verification</h2>
        <table className="w-full border">
          <thead>
            <tr><th>Name</th><th>Type</th><th>Verified</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {vendors.map((vendor: any) => (
              <tr key={vendor._id}>
                <td>{vendor.name}</td>
                <td>{vendor.vendorType}</td>
                <td>{vendor.verified ? 'Yes' : 'No'}</td>
                <td>
                  {!vendor.verified && (
                    <button 
                      onClick={() => verifyVendor(vendor._id)} 
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Orders Management</h2>
        {/* Similar table for orders, with fulfill buttons */}
        <table className="w-full border">
          <thead>
            <tr><th>ID</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === 'accepted' && (
                    <button 
                      onClick={() => {/* Call fulfill endpoint */}} 
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Fulfill
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
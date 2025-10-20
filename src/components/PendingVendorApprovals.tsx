'use client';

import { useState } from 'react';

interface Vendor {
  _id: string;
  name: string;
  vendorType: string;
  location: { coordinates: [number, number] };
  verificationStatus?: 'pending' | 'verified' | 'rejected' | 'suspended';
}

interface Props {
  vendors: Vendor[];
  onUpdate?: (vendorId: string) => void; // Callback to update parent pending count
}

export default function PendingVendorApprovals({ vendors, onUpdate }: Props) {
  const [vendorList, setVendorList] = useState(vendors);

  const handleAction = async (vendorId: string, action: 'verify' | 'reject' | 'suspend') => {
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update vendor');

      // Update vendor in local state
      setVendorList((prev) =>
        prev.map((v) =>
          v._id === vendorId ? { ...v, verificationStatus: action === 'verify' ? 'verified' : action } : v
        )
      );

      // Notify parent to update pending count
      if (onUpdate && action === 'verify') onUpdate(vendorId);
    } catch (error) {
      console.error('Action failed:', error);
      alert('Action failed: ' + (error as Error).message);
    }
  };

  if (vendorList.length === 0) return <p>No pending vendors.</p>;

  return (
    <div className="space-y-4">
      {vendorList.map((vendor) => (
        <div
          key={vendor._id}
          className="flex justify-between items-center p-4 border rounded"
        >
          <div>
            <span className="font-semibold">{vendor.name}</span>
            <span className="ml-2 text-sm text-gray-500">({vendor.vendorType})</span>
            <p className="text-sm text-gray-600">
              {vendor.location.coordinates[0]}, {vendor.location.coordinates[1]}
            </p>
            {vendor.verificationStatus && (
              <span
                className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                  vendor.verificationStatus === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : vendor.verificationStatus === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {vendor.verificationStatus.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            {vendor.verificationStatus === 'pending' || !vendor.verificationStatus ? (
              <>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handleAction(vendor._id, 'verify')}
                >
                  Verify
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleAction(vendor._id, 'reject')}
                >
                  Reject
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  onClick={() => handleAction(vendor._id, 'suspend')}
                >
                  Suspend
                </button>
              </>
            ) : (
              <span className="text-gray-500 text-sm">Action taken</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

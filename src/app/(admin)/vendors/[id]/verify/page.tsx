'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function VerifyVendorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/vendors/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setVendor(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await fetch(`/api/admin/vendors/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify');

      alert('Vendor verified successfully');
      router.push('/admin/vendors'); // redirect back to vendor list
    } catch (err: any) {
      alert(err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="p-6">Loading vendor details...</div>;
  if (!vendor) return <div className="p-6">Vendor not found</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Verify Vendor</h1>

      <div className="space-y-2 mb-6">
        <p><strong>Name:</strong> {vendor.name}</p>
        <p><strong>Type:</strong> {vendor.vendorType}</p>
        <p><strong>Location:</strong> {vendor.location?.coordinates?.join(', ')}</p>
        <p><strong>Status:</strong> {vendor.verified ? 'Verified' : 'Pending'}</p>
      </div>

      {!vendor.verified ? (
        <button
          onClick={handleVerify}
          disabled={verifying}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {verifying ? 'Verifying...' : 'Verify Vendor'}
        </button>
      ) : (
        <p className="text-green-600 font-semibold">Vendor already verified ✅</p>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VendorCard from '@/components/VendorCard';
import type { Vendor } from '@/types';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [cart, setCart] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch('/api/vendors');
        const data: Vendor[] = await res.json();
        setVendors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleAddToCart = (vendor: Vendor) => {
    setCart((prev) => {
      if (prev.find((v) => v._id === vendor._id)) return prev; // prevent duplicates
      return [...prev, vendor];
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">All Vendors</h1>
      <p className="text-center text-gray-600">Browse food, drinks, and grocery vendors in Zimbabwe.</p>

      {loading ? (
        <p className="text-center text-gray-600">Loading vendors...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : vendors.length === 0 ? (
        <p className="text-center text-gray-600">No vendors found. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <VendorCard key={vendor._id} vendor={vendor} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded p-4 w-64">
          <h3 className="font-semibold">Cart ({cart.length})</h3>
          <ul className="text-sm">
            {cart.map((item) => (
              <li key={item._id}>{item.name}</li>
            ))}
          </ul>
          <Link href="/checkout" className="block mt-2 bg-primary text-white text-center py-1 rounded">
            Go to Checkout
          </Link>
        </div>
      )}

      <div className="text-center mt-6">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Map
        </Link>
      </div>
    </div>
  );
}

'use client';

import { Vendor } from '@/types';

interface VendorCardProps {
  vendor: Vendor;
  onAddToCart: (vendor: Vendor) => void;
}

export default function VendorCard({ vendor, onAddToCart }: VendorCardProps) {
  return (
    <div className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
      <h3 className="font-semibold">{vendor.name}</h3>
      <p className="text-sm text-gray-600">{vendor.vendorType}</p>
      <p className="text-xs">Payout: {vendor.payoutMethod}</p>
      <button
        onClick={() => onAddToCart(vendor)}
        className="mt-2 bg-primary text-white px-3 py-1 rounded text-sm w-full"
      >
        Add to Cart
      </button>
    </div>
  );
}

// src/components/VendorCard.tsx
import Link from 'next/link';
import { Vendor } from '@/types'; // Define interface

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link href={`/vendors/${vendor._id}`} className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
      <h3 className="font-semibold">{vendor.name}</h3>
      <p className="text-sm text-gray-600">{vendor.vendorType}</p>
      <p className="text-xs">Payout: {vendor.payoutMethod}</p>
    </Link>
  );
}
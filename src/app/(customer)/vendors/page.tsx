// src/app/(customer)/vendors/page.tsx
import Link from 'next/link';
import VendorCard from '@/components/VendorCard'; // Reuse your existing card
import { fetchVendors } from '@/lib/db';

export default async function VendorsPage() {
  const vendors = await fetchVendors();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">All Vendors</h1>
      <p className="text-center text-gray-600">Browse food, drinks, and grocery vendors in Zimbabwe.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <Link key={vendor._id} href={`/vendors/${vendor._id}`}>
            <VendorCard vendor={vendor} />
          </Link>
        ))}
      </div>
      {vendors.length === 0 && <p className="text-center">No vendors found. Check back soon!</p>}
      <div className="text-center">
        <Link href="/" className="text-blue-500 hover:underline">Back to Map</Link>
      </div>
    </div>
  );
}
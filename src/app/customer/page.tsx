// src/app/(customer)/page.tsx
import MapView from '@/components/MapView';
import VendorCard from '@/components/VendorCard';
import { fetchVendors } from '@/lib/db'; // Helper to query MongoDB (geospatial near user)

export default async function Home() {
  const vendors = await fetchVendors(); // Returns array of vendors with location

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Discover Vendors Near You</h1>
      <MapView vendors={vendors} /> {/* Pass vendors for markers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vendors.slice(0, 6).map(vendor => (
          <VendorCard key={vendor._id} vendor={vendor} />
        ))}
      </div>
    </div>
  );
}
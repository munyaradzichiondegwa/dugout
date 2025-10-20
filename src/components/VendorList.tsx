import Vendor from '@/models/Vendor';
import dbConnect from '@/lib/mongodb';

export default async function VendorList() {
  await dbConnect();

  const vendors = await Vendor.find({}).lean(); // Fetch all vendors

  if (!vendors || vendors.length === 0) {
    return <p>No vendors found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {vendors.map((vendor) => (
        <div key={vendor._id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-1">{vendor.name}</h2>
          <p className="text-sm text-gray-500 mb-2">
            Type: {vendor.vendorType.toUpperCase()} | Payout: {vendor.payoutMethod}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Location: {vendor.location.coordinates[1].toFixed(4)}, {vendor.location.coordinates[0].toFixed(4)}
          </p>
          <h3 className="font-semibold mt-2">Menu Items:</h3>
          <ul className="list-disc list-inside">
            {vendor.items.map((item, idx) => (
              <li key={idx}>
                {item.name} ({item.category}) — ${(item.price / 100).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// src/app/(customer)/vendors/[id]/page.tsx
import { fetchVendorById } from '@/lib/db';
import { useCart } from '@/lib/cartContext';

interface Props { params: { id: string }; }

export default async function VendorPage({ params }: Props) {
  const vendor = await fetchVendorById(params.id);
  if (!vendor) return <div>Vendor not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{vendor.name}</h1>
      <p>Type: {vendor.vendorType}</p>
      {/* Tabs for categories: Food, Beverage, Grocery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendor.items?.map(item => (
          <div key={item._id} className="p-4 border rounded">
            <h3>{item.name}</h3>
            <p>{item.category} - ${item.price / 100}</p>
            <button
              onClick={() => useCart().dispatch({ type: 'ADD_ITEM', payload: { menuItemId: item._id, name: item.name, price: item.price, vendorId: vendor._id } })}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <Link href="/cart" className="bg-green-500 text-white px-6 py-2 rounded">
        View Cart ({useCart().state.items.length})
      </Link>
    </div>
  );
}
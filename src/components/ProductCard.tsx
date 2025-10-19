interface ProductCardProps {
  item: any;
  onAddToCart: (id: string, qty: number) => void;
}

export default function ProductCard({ item, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      {item.image && <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-2" />}
      <h3 className="font-bold">{item.name}</h3>
      <p className="text-gray-600">{item.category} - {item.itemType}</p>
      <p className="text-lg font-semibold">${(item.price / 100).toFixed(2)} {item.currency}</p>
      {item.unit && <p>Unit: {item.unit}</p>}
      <button 
        onClick={() => onAddToCart(item._id, 1)}
        className="bg-primary text-white px-4 py-2 rounded mt-2"
      >
        Add to Cart
      </button>
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ShoppingCart from '@/components/ShoppingCart';

export default function VendorPage() {
  const params = useParams();
  const vendorId = params.id;

  const [items, setItems] = useState<any[]>([]);
  const [cart, setCart] = useState<{ items: any[]; totalAmount: number }>({ items: [], totalAmount: 0 });

  // Fetch menu items and cart on load
  useEffect(() => {
    fetch(`/api/menuItems?vendorId=${vendorId}`)
      .then(res => res.json())
      .then(setItems);

    fetch(`/api/carts?vendorId=${vendorId}`)
      .then(res => res.json())
      .then(setCart);
  }, [vendorId]);

  // Add item to cart
  const addToCart = async (itemId: string, quantity: number) => {
    await fetch('/api/carts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId, items: [{ menuItemId: itemId, quantity }], currency: 'USD' }),
    });
    // Refresh cart
    const newCart = await fetch(`/api/carts?vendorId=${vendorId}`).then(res => res.json());
    setCart(newCart);
  };

  // Checkout flow
  const onCheckout = async () => {
    if (cart.items.length === 0) return;

    try {
      // Step 1: Check wallet
      const walletRes = await fetch('/api/wallets');
      const wallet = await walletRes.json();
      if (wallet.balance < cart.totalAmount) {
        alert('Insufficient balance');
        return;
      }

      // Step 2: Place hold and create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, orderType: 'instant' }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error);

      // Step 3: Mock notify vendor
      console.log(`Order ${order._id} created. Notifying vendor: ${vendorId} via mock SMS/Email: "New order incoming!"`);

      alert('Order placed successfully!');
      setCart({ items: [], totalAmount: 0 }); // Clear cart
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed: ' + (error as Error).message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Vendor Storefront</h2>

      {/* Tabs */}
      <div className="tabs mb-4">
        <button className="tab tab-active">Food</button>
        <button className="tab">Drinks</button>
        <button className="tab">Groceries</button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <ProductCard key={item._id} item={item} onAddToCart={addToCart} />
        ))}
      </div>

      {/* Shopping Cart */}
      <ShoppingCart cart={cart} onCheckout={onCheckout} />
    </div>
  );
}

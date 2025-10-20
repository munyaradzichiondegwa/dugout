'use client';

import { useState } from 'react';
import { formatAmount } from '@/lib/utils';

interface CartItem {
  menuItemId: { _id: string; name: string };
  quantity: number;
}

interface Cart {
  items: CartItem[];
  totalAmount: number;
  currency: string;
}

interface ShoppingCartProps {
  cart: Cart;
  onCheckout: () => void;
}

export default function ShoppingCart({ cart, onCheckout }: ShoppingCartProps) {
  const [show, setShow] = useState(true);

  if (!cart?.items || cart.items.length === 0) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg ${
        show ? 'block' : 'hidden'
      }`}
    >
      <h3 className="font-bold">Cart ({cart.items.length} items)</h3>
      <ul>
        {cart.items.map((item) => (
          <li key={item.menuItemId._id}>
            {item.menuItemId.name} x{item.quantity}
          </li>
        ))}
      </ul>
      <p>Total: {formatAmount(cart.totalAmount, cart.currency)}</p>
      <button
        onClick={onCheckout}
        className="bg-primary text-white px-4 py-2 rounded w-full mt-2"
      >
        Proceed to Checkout
      </button>
      <button onClick={() => setShow(!show)} className="mt-2 text-sm">
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

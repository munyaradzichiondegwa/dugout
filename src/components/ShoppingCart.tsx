'use client';
import { useState } from 'react';
import { formatAmount } from '@/lib/utils';

interface ShoppingCartProps {
  cart: any;
  onCheckout: () => void;
}

export default function ShoppingCart({ cart, onCheckout }: ShoppingCartProps) {
  const [show, setShow] = useState(false);

  if (cart.items.length === 0) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg ${show ? 'block' : 'hidden'}`}>
      <h3 className="font-bold">Cart ({cart.items.length} items)</h3>
      <ul>
        {cart.items.map((item: any) => (
          <li key={item.menuItemId._id}>{item.menuItemId.name} x{item.quantity}</li>
        ))}
      </ul>
      <p>Total: {formatAmount(cart.totalAmount, cart.currency)}</p>
      <button onClick={onCheckout} className="bg-primary text-white px-4 py-2 rounded w-full">
        Proceed to Checkout
      </button>
      <button onClick={() => setShow(!show)} className="mt-2 text-sm">Hide</button>
    </div>
  );
}
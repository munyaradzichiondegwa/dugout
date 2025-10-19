// src/app/(customer)/cart/page.tsx
'use client';
import { useCart } from '@/lib/cartContext';
import { useWallet } from '@/lib/walletContext'; // Similar Context for wallet
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function Cart() {
  const { state, dispatch } = useCart();
  const { balance } = useWallet(); // Fetch from API/Context

  const canCheckout = state.totalAmount <= balance;

  const handleCheckout = async () => {
    if (!canCheckout) {
      toast.error('Insufficient balance');
      return;
    }
    // API call: Hold wallet, create order
    const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify({ cart: state }) });
    if (res.ok) {
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Order placed!');
      window.location.href = '/orders'; // Or show confirmation
    }
  };

  if (state.items.length === 0) return <div className="text-center">Cart empty. <Link href="/">Shop now</Link></div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {state.items.map(item => (
        <div key={item.menuItemId} className="flex justify-between p-4 border-b">
          <div>
            <h3>{item.name}</h3>
            <p>Qty: {item.quantity} x ${item.price / 100}</p>
          </div>
          <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.menuItemId })} className="text-red-500">
            Remove
          </button>
        </div>
      ))}
      <div className="text-xl font-bold">Total: ${state.totalAmount / 100}</div>
      <p>Balance: ${balance / 100} {canCheckout ? '(Sufficient)' : '(Top up needed)'}</p>
      <button onClick={handleCheckout} disabled={!canCheckout} className="bg-green-500 disabled:bg-gray-300 text-white px-6 py-2 rounded w-full">
        Checkout
      </button>
    </div>
  );
}
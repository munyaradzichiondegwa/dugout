'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { fetchWalletByUserId } from '@/lib/db';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CartPage() {
  const { state, dispatch } = useCart();
  const [wallet, setWallet] = useState({ balance: 0, pendingHold: 0 });
  const [loadingWallet, setLoadingWallet] = useState(true);

  // Replace with actual user ID from session/context in production
  const userId = 'mock-user-id';

  // Fetch wallet data
  useEffect(() => {
    fetchWalletByUserId(userId)
      .then(setWallet)
      .catch((err) => {
        console.error(err);
        toast.error('Failed to fetch wallet');
      })
      .finally(() => setLoadingWallet(false));
  }, [userId]);

  const canCheckout = state.totalAmount <= wallet.balance;

  const handleCheckout = () => {
    if (loadingWallet) return;

    if (!canCheckout) {
      toast.error('Insufficient balance. Please top up your wallet.');
      return;
    }

    toast.loading('Processing checkout...');
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Order placed successfully!');
    }, 2000);
  };

  if (loadingWallet) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <p>Add items from vendors to start shopping.</p>
        <Link href="/vendors" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Browse Vendors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="space-y-4">
        {state.items.map((item) => (
          <div key={item.menuItemId} className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">
                Qty: {item.quantity} x ${item.price / 100}
              </p>
              <p className="text-sm text-gray-500">
                Subtotal: ${(item.quantity * item.price / 100).toFixed(2)}
              </p>
            </div>
            <div className="flex space-x-2 items-center">
              <button
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_QUANTITY',
                    payload: { menuItemId: item.menuItemId, quantity: item.quantity - 1 },
                  })
                }
                className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch({
                    type: 'ADD_ITEM',
                    payload: { menuItemId: item.menuItemId, name: item.name, price: item.price, quantity: 1 },
                  })
                }
                className="bg-gray-200 px-2 py-1 rounded"
              >
                +
              </button>
              <button
                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.menuItemId })}
                className="text-red-500 ml-4"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex justify-between text-lg font-bold">
          <span>Total: ${(state.totalAmount / 100).toFixed(2)}</span>
          <span>
            Balance: ${(wallet.balance / 100).toFixed(2)} (Hold: ${(wallet.pendingHold / 100).toFixed(2)})
          </span>
        </div>
        <p className={`text-sm ${canCheckout ? 'text-green-600' : 'text-red-600'}`}>
          {canCheckout ? 'Sufficient balance' : 'Top up required'}
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleCheckout}
          disabled={!canCheckout}
          className="flex-1 bg-green-500 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
        >
          Checkout & Pay
        </button>
        <Link
          href="/wallet"
          className="flex-1 bg-blue-500 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-600"
        >
          Top Up Wallet
        </Link>
      </div>

      <Link href="/" className="block text-center text-blue-500 hover:underline">
        Continue Shopping
      </Link>
    </div>
  );
}

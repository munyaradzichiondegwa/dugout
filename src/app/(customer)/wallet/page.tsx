'use client';
import { useState, useEffect } from 'react';
import { fetchWalletByUserId } from '@/lib/db'; // Fixed: Use exported function
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function WalletPage() {
  const [wallet, setWallet] = useState({ balance: 0, pendingHold: 0, currency: 'USD' });
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('EcoCash');
  const [loading, setLoading] = useState(true);

  // Mock user ID (replace with real session/context in production)
  const userId = 'mock-user-id'; // e.g., from useSession() or context

  useEffect(() => {
    fetchWalletByUserId(userId)
      .then(setWallet)
      .catch((err) => {
        console.error(err);
        toast.error('Failed to fetch wallet');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    setLoading(true);
    // Simulate API (POST to /api/wallets/topup)
    toast.loading('Processing top-up...');
    setTimeout(() => {
      setWallet(prev => ({ ...prev, balance: prev.balance + (amount * 100) })); // Cents
      toast.success(`Topped up $${amount} via ${method}`);
      setLoading(false);
      setAmount(0);
    }, 2000);
  };

  if (loading) return <div className="text-center py-8">Loading wallet...</div>;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">DugOut Wallet</h1>
      <div className="bg-green-100 p-6 rounded-lg text-center">
        <h2 className="text-xl mb-2">Available Balance</h2>
        <p className="text-4xl font-bold">${(wallet.balance / 100).toFixed(2)} {wallet.currency}</p>
        <p className="text-sm text-gray-600 mt-2">Pending Hold: ${(wallet.pendingHold / 100).toFixed(2)}</p>
      </div>
      <form onSubmit={handleTopUp} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <label className="block">
          <span className="text-sm font-medium">Amount (USD)</span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-3 border rounded-lg mt-1"
            placeholder="e.g., 10"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Payment Method</span>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-3 border rounded-lg mt-1"
          >
            <option>EcoCash</option>
            <option>ZIPIT</option>
            <option>Bank Transfer</option>
            <option>Voucher</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={loading || amount <= 0}
          className="w-full bg-blue-500 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          {loading ? 'Processing...' : `Top Up $${amount || 0}`}
        </button>
      </form>
      <div className="text-center space-y-2">
        <Link href="/transactions" className="text-blue-500 hover:underline block">View Transactions</Link>
        <Link href="/support" className="text-blue-500 hover:underline block">Need Help?</Link>
      </div>
    </div>
  );
}
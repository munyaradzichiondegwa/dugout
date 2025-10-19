'use client';

import { useState, useEffect } from 'react';
import { formatAmount } from '@/lib/utils';

interface Wallet {
  USD: number;
  ZWL: number;
  pendingHold: number;
}

export default function WalletBalance() {
  const [wallet, setWallet] = useState<Wallet>({ USD: 0, ZWL: 0, pendingHold: 0 });

  useEffect(() => {
    async function fetchWallet() {
      try {
        const res = await fetch('/api/wallets');
        if (!res.ok) throw new Error('Failed to fetch wallet');
        const data = await res.json();
        setWallet(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchWallet();
  }, []);

  return (
    <div className="flex items-center gap-4 bg-green-100 p-3 rounded-lg shadow-sm">
      <div className="text-center">
        <h2 className="text-sm font-semibold">USD Balance</h2>
        <p className="text-lg font-bold">{formatAmount(wallet.USD - wallet.pendingHold, 'USD')}</p>
        <p className="text-xs text-gray-600">Pending Hold: {formatAmount(wallet.pendingHold, 'USD')}</p>
      </div>

      <div className="text-center">
        <h2 className="text-sm font-semibold">ZWL Balance</h2>
        <p className="text-lg font-bold">{formatAmount(wallet.ZWL, 'ZWL')}</p>
      </div>

      <button
        className="ml-auto bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 transition"
        onClick={() => {
          // TODO: Open top-up modal
        }}
      >
        Top Up
      </button>
    </div>
  );
}

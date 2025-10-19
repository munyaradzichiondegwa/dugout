// src/app/(customer)/wallet/page.tsx
import WalletBalance from '@/components/WalletBalance';
import { fetchWallet } from '@/lib/db';

export default async function Wallet() {
  const wallet = await fetchWallet(); // From user session

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">DugOut Wallet</h1>
      <WalletBalance wallet={wallet} />
      {/* Top-up form: Select EcoCash/ZIPIT, generate ref, POST to /api/wallets/topup */}
      <form className="space-y-4">
        <select className="w-full p-2 border rounded">
          <option>EcoCash</option>
          <option>ZIPIT</option>
          <option>Voucher</option>
        </select>
        <input type="number" placeholder="Amount (USD)" className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded w-full">
          Top Up
        </button>
      </form>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/transactions" className="p-4 bg-white rounded shadow text-center">Transactions</Link>
        <Link href="/payouts" className="p-4 bg-white rounded shadow text-center">Payouts</Link>
      </div>
    </div>
  );
}
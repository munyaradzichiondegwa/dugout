// src/components/TopNav.tsx
'use client';
import NavBar from './NavBar';
import WalletBalance from './WalletBalance';
import { CartProvider } from '@/lib/cartContext';

export default function TopNav() {
  return (
    <CartProvider>
      <nav className="bg-green-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
        <NavBar />
        <WalletBalance />
      </nav>
    </CartProvider>
  );
}

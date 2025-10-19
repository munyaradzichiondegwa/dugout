// src/components/NavBar.tsx
'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cartContext'; // We'll create this

export default function NavBar() {
  const { cartItemCount } = useCart(); // From Context (0 if empty)

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            DugOut
          </Link>
          <div className="flex space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/wallet" className="hover:underline">Wallet</Link>
            <Link href="/cart" className="relative hover:underline">
              Cart ({cartItemCount})
            </Link>
            <Link href="/login" className="hover:underline">Login</Link>
            {/* Add Register, Profile, Logout later */}
          </div>
        </div>
      </div>
    </nav>
  );
}
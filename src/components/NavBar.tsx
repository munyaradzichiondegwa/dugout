'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cartContext';
import { useUser } from '@/context/UserContext';

export default function NavBar() {
  const { state } = useCart();
  const cartItemCount = state.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0;
  const { user } = useUser() || {};

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            DugOut
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/wallet" className="hover:underline">Wallet</Link>
            <Link href="/vendors" className="hover:underline">Vendors</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/vendors/enroll" className="hover:underline">Enroll</Link>
            <Link href="/support" className="hover:underline">Support</Link>

            {/* Cart */}
            <Link href="/cart" className="relative hover:underline">
              Cart ({cartItemCount})
            </Link>

            {/* Conditionally show Admin */}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="hover:underline font-semibold text-yellow-300"
              >
                Admin
              </Link>
            )}

            {/* Auth */}
            <Link href="/login" className="hover:underline">Login</Link>
            {/* Future: Register | Profile | Logout */}
          </div>
        </div>
      </div>
    </nav>
  );
}

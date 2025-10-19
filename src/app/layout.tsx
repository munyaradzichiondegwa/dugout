import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/lib/cartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "DugOut - Zimbabwe's Multi-Vendor App",
  description:
    'Discover, order, and reserve from restaurants, bars, and grocery shops with secure mobile payments.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        {/* CartProvider wraps everything that may use cart */}
        <CartProvider>
          {/* Global Top Navigation */}
          <TopNav />

          {/* Main page content */}
          <main className="flex-1 bg-gray-50 p-4 md:p-6">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Notifications */}
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}

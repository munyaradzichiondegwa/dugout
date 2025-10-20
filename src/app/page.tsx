'use client';

import { useState, useEffect } from 'react';
import MapView from '@/components/MapView';
import VendorCard from '@/components/VendorCard';
import WalletBalance from '@/components/WalletBalance';
import ShoppingCart from '@/components/ShoppingCart';
import type { Vendor } from '@/types';

interface CartItem {
  menuItemId: Vendor;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  totalAmount: number;
  currency: string;
}

export default function HomePage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [userLocation, setUserLocation] = useState({ lng: 31.0461, lat: -17.8252 });
  const [locationLoading, setLocationLoading] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart] = useState<Cart>({ items: [], totalAmount: 0, currency: 'USD' });

  // Detect user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lng: pos.coords.longitude, lat: pos.coords.latitude });
          setLocationLoading(false);
        },
        () => setLocationLoading(false),
        { enableHighAccuracy: true }
      );
    } else setLocationLoading(false);
  }, []);

  // Fetch vendors near user
  useEffect(() => {
    if (locationLoading) return;
    setLoadingVendors(true);
    fetch(`/api/vendors?lng=${userLocation.lng}&lat=${userLocation.lat}`)
      .then(async (res) => {
        const data = await res.json();
        setVendors(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setError('Failed to load vendors');
        setVendors([]);
      })
      .finally(() => setLoadingVendors(false));
  }, [userLocation, locationLoading]);

  const handleAddToCart = (vendor: Vendor) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.menuItemId._id === vendor._id);
      let updatedItems;
      if (existing) {
        updatedItems = prev.items.map((i) =>
          i.menuItemId._id === vendor._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedItems = [...prev.items, { menuItemId: vendor, quantity: 1 }];
      }

      const totalAmount = updatedItems.reduce(
        (sum, i) => sum + (i.menuItemId.price || 0) * i.quantity,
        0
      );

      return { ...prev, items: updatedItems, totalAmount };
    });
  };

  const handleCheckout = () => {
    console.log('Checkout clicked', cart);
    alert(`Checkout ${cart.items.length} items for ${cart.totalAmount} ${cart.currency}`);
  };

  if (locationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">📍 Detecting your location...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold">Discover Vendors Near You</h1>
        <WalletBalance />
      </header>

      <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
        <MapView vendors={vendors} userLocation={userLocation} />
      </div>

      {loadingVendors ? (
        <p className="text-center text-gray-600">Loading vendors...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : vendors.length === 0 ? (
        <p className="text-center text-gray-600">No vendors found nearby.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {vendors.map((vendor) => (
            <VendorCard key={vendor._id} vendor={vendor} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}

      {cart.items.length > 0 && <ShoppingCart cart={cart} onCheckout={handleCheckout} />}
    </main>
  );
}

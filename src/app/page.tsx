'use client';

import { useState, useEffect } from 'react';
import MapView from '@/components/MapView';
import VendorCard from '@/components/VendorCard';
import WalletBalance from '@/components/WalletBalance';
import type { Vendor } from '@/types';

export default function Home() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [userLocation, setUserLocation] = useState({ lng: 31.0461, lat: -17.8252 }); // Default Harare
  const [locationLoading, setLocationLoading] = useState(true);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setLocationLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation not supported');
      setLocationLoading(false);
    }
  }, []);

  // Fetch vendors near user
  useEffect(() => {
    if (locationLoading) return;

    setLoadingVendors(true);
    fetch(`/api/vendors?lng=${userLocation.lng}&lat=${userLocation.lat}`)
      .then(async (res) => {
        const data = await res.json();
        if (Array.isArray(data)) {
          setVendors(data);
        } else {
          console.warn('API did not return an array, fallback to empty');
          setVendors([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load vendors');
        setVendors([]);
      })
      .finally(() => setLoadingVendors(false));
  }, [userLocation, locationLoading]);

  if (locationLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-gray-600">📍 Detecting your location...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-7xl mx-auto w-full p-6 md:p-10 gap-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
        Discover Vendors Near You
      </h1>

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
            <VendorCard key={vendor._id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from 'next/navigation';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

interface Vendor {
  id: string;
  name: string;
  location: { coordinates: [number, number] };
  vendorType: 'food' | 'beverage' | 'grocery';
}

interface MapViewProps {
  vendors: Vendor[];
  userLocation?: { lng: number; lat: number }; // Optional
}

export default function MapView({ vendors, userLocation }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!mapContainer.current) return;
    if (!userLocation?.lng || !userLocation?.lat) return; // Guard against undefined

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [userLocation.lng, userLocation.lat],
      zoom: 12,
    });

    // Add user marker
    new mapboxgl.Marker({ color: '#1E90FF' })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new mapboxgl.Popup().setText('You are here'))
      .addTo(map);

    // Add vendor markers
    vendors.forEach((vendor) => {
      const color =
        vendor.vendorType === 'food'
          ? '#FF0000'
          : vendor.vendorType === 'beverage'
          ? '#FFA500'
          : '#008000';

      const marker = new mapboxgl.Marker({ color })
        .setLngLat(vendor.location.coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h3>${vendor.name}</h3><p>Type: ${vendor.vendorType}</p><a href="/vendors/${vendor.id}">View Menu</a>`
          )
        )
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        router.push(`/vendors/${vendor.id}`);
      });
    });

    return () => map.remove();
  }, [vendors, userLocation, router]);

  // Optional: loading UI until location is available
  if (!userLocation) return <p>Loading map...</p>;

  return (
    <div
      ref={mapContainer}
      id="map"
      className="h-[400px] w-full rounded-lg overflow-hidden shadow-md"
    />
  );
}

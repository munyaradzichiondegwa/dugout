// Redirect to last vendor cart or show summary
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();

  useEffect(() => {
    // Fetch active cart and redirect to vendor
    fetch('/api/carts').then(res => res.json()).then(cart => {
      if (cart.vendorId) router.push(`/vendors/${cart.vendorId}`);
      else router.push('/');
    });
  }, [router]);

  return <div>Loading cart...</div>;
}
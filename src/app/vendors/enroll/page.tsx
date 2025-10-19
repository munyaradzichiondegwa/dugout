// src/app/vendors/enroll/page.tsx
'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function VendorEnrollmentPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vendorType: 'food' as 'food' | 'beverage' | 'grocery',
    payoutMethod: 'EcoCash',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate POST to /api/vendors/enroll
    toast.loading('Submitting enrollment...');
    setTimeout(() => {
      toast.success('Enrollment submitted! Await verification.');
      setLoading(false);
      // Reset form or redirect
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold text-center">Vendor Enrollment</h1>
      <p className="text-center text-gray-600">Join DugOut as a food, beverage, or grocery vendor.</p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <label className="block">
          <span className="text-sm font-medium">Business Name</span>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-lg mt-1"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Phone (e.g., 263712345678)</span>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 border rounded-lg mt-1"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Vendor Type</span>
          <select
            value={formData.vendorType}
            onChange={(e) => setFormData({ ...formData, vendorType: e.target.value as any })}
            className="w-full p-3 border rounded-lg mt-1"
          >
            <option value="food">Food/Restaurant</option>
            <option value="beverage">Beverage/Bar</option>
            <option value="grocery">Grocery/Supermarket</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Payout Method</span>
          <select
            value={formData.payoutMethod}
            onChange={(e) => setFormData({ ...formData, payoutMethod: e.target.value })}
            className="w-full p-3 border rounded-lg mt-1"
          >
            <option>EcoCash</option>
            <option>Bank Transfer</option>
            <option>ZIPIT</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
        >
          {loading ? 'Submitting...' : 'Enroll Now'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500">
        Already enrolled? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </div>
  );
}
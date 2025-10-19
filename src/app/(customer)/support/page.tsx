// src/app/(customer)/support/page.tsx
'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function SupportPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    setLoading(true);
    // Simulate POST to /api/support
    toast.loading('Sending message...');
    setTimeout(() => {
      toast.success('Support request sent! We will respond soon.');
      setLoading(false);
      setMessage('');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold text-center">Support</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Get Help</h2>
        <p className="mb-4">For issues with orders, wallet, or vendors, contact us.</p>
        <div className="space-y-2 mb-6">
          <p><strong>Email:</strong> support@dugoutzw.com</p>
          <p><strong>Phone:</strong> +263 77 123 4567 (Mon-Fri, 9AM-5PM)</p>
          <p><strong>FAQs:</strong> Common questions on wallet top-ups and deliveries.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Your Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full p-3 border rounded-lg mt-1"
              placeholder="Describe your issue..."
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
      <div className="text-center">
        <Link href="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}
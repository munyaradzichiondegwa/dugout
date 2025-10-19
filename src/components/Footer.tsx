// src/components/Footer.tsx
'use client';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // npm install react-icons

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">DugOut</h3>
            <p className="text-sm text-gray-300">
              Zimbabwe's multi-vendor platform for food, drinks, and groceries. 
              Seamless wallet, maps, and local payments.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/dugoutzw" aria-label="Facebook"><FaFacebook className="text-blue-400 hover:text-blue-300" /></a>
              <a href="https://twitter.com/dugoutzw" aria-label="Twitter"><FaTwitter className="text-blue-400 hover:text-blue-300" /></a>
              <a href="https://instagram.com/dugoutzw" aria-label="Instagram"><FaInstagram className="text-pink-400 hover:text-pink-300" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
              <li><Link href="/vendors" className="hover:text-gray-300">Vendors</Link></li>
              <li><Link href="/wallet" className="hover:text-gray-300">Wallet</Link></li>
              <li><Link href="/cart" className="hover:text-gray-300">Cart</Link></li>
              <li><Link href="/dashboard" className="hover:text-gray-300">Admin</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-gray-300">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-gray-300">Contact</Link></li>
              <li><Link href="/vendors/enroll" className="hover:text-gray-300">Vendor Enrollment</Link></li>
              <li><Link href="/support" className="hover:text-gray-300">Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt />
                <span>Harare, Zimbabwe</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone />
                <span>+263 77 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope />
                <span>hello@dugoutzw.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 mt-8 text-center text-sm text-gray-300">
          <p>&copy; {currentYear} DugOut. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/compliance" className="hover:text-white">Zimbabwe Regulations</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
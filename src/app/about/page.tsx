// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <h1 className="text-3xl font-bold text-center">About DugOut</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-lg mb-4">
          DugOut is Zimbabwe's premier multi-vendor platform, connecting users with restaurants, bars, and grocery shops.
          Built for our community, we support ZWL/USD wallets, local payments (EcoCash, ZIPIT), and Mapbox-powered discovery.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Our Mission</h2>
        <p>To make everyday shopping seamless in a cash-heavy economy, with secure transactions and vendor verification.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Team</h2>
        <p>Founded in Harare, our team focuses on Zimbabwe-first features like geospatial search and unified carts.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded">
            <h3 className="font-semibold">Secure Wallet</h3>
            <p>Multi-currency with holds and audits.</p>
          </div>
          <div className="text-center p-4 border rounded">
            <h3 className="font-semibold">Local Integration</h3>
            <p>EcoCash, OneMoney, and agent vouchers.</p>
          </div>
          <div className="text-center p-4 border rounded">
            <h3 className="font-semibold">Geospatial Map</h3>
            <p>Find vendors near you in Harare and beyond.</p>
          </div>
        </div>
      </div>
      <div className="text-center">
        <Link href="/vendors/enroll" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Join as Vendor
        </Link>
      </div>
    </div>
  );
}
// src/app/about/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, duration: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-8 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-3xl font-bold text-center"
        variants={itemVariants}
      >
        About DugOut
      </motion.h1>

      <motion.div
        className="bg-white p-6 rounded-lg shadow space-y-6"
        variants={itemVariants}
      >
        <p className="text-lg">
          DugOut is Zimbabwe's premier multi-vendor platform, connecting users
          with restaurants, bars, and grocery shops. Built for our community, we
          support ZWL/USD wallets, local payments (EcoCash, ZIPIT), and
          Mapbox-powered discovery.
        </p>

        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold mt-6 mb-2">Our Mission</h2>
          <p>
            To make everyday shopping seamless in a cash-heavy economy, with
            secure transactions and vendor verification.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold mt-6 mb-2">Team</h2>
          <p>
            Founded in Harare, our team focuses on Zimbabwe-first features like
            geospatial search and unified carts.
          </p>
        </motion.div>

        <motion.div
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={itemVariants}
        >
          {[
            { title: "Secure Wallet", desc: "Multi-currency with holds and audits." },
            { title: "Local Integration", desc: "EcoCash, OneMoney, and agent vouchers." },
            { title: "Geospatial Map", desc: "Find vendors near you in Harare and beyond." },
          ].map((card) => (
            <motion.div
              key={card.title}
              className="text-center p-4 border rounded"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-semibold">{card.title}</h3>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="text-center"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
      >
        <Link
          href="/vendors/enroll"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Join as Vendor
        </Link>
      </motion.div>
    </motion.div>
  );
}

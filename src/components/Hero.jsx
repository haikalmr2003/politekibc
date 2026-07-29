import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Illustration from "../assets/illustration.svg?raw";

/**
 * Hero section with headline, subtitle, CTA buttons and an illustration.
 * Uses Framer Motion for entry animations.
 */
export default function Hero() {
  return (
    <section className="pt-24 pb-12 bg-ibc-light">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl md:text-5xl font-extrabold text-ibc-blue leading-tight">
            Bangun Masa Depan Digital Bersama POLITEK IBC
          </h1>
          <p className="mt-4 text-gray-700 max-w-xl">
            Belajar Komputer, Microsoft Office, AI Productivity, Bahasa Inggris, Canva dan Digital Skill untuk Kerja maupun Kuliah.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/placement-test" className="inline-flex items-center px-5 py-3 bg-ibc-red text-white rounded-md font-semibold shadow">
              Daftar Sekarang
            </Link>
            <Link to="/placement-test" className="inline-flex items-center px-5 py-3 border border-ibc-red rounded-md text-ibc-red font-medium">
              Placement Test Gratis
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="flex justify-center md:justify-end">
          <div className="w-full max-w-md">
            {/* inline SVG import - safe and fast */}
            <div className="bg-gradient-to-br from-red-50 to-blue-50 p-6 rounded-xl shadow">
              <div dangerouslySetInnerHTML={{ __html: Illustration }} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

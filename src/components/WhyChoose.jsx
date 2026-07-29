import React from "react";
import { motion } from "framer-motion";

/**
 * Grid of reasons to choose Politek IBC.
 */
export default function WhyChoose({ items }) {
  return (
    <section id="about" className="py-12 bg-ibc-light">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-ibc-blue mb-6">Mengapa Memilih Politek IBC</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((it, idx) => (
            <motion.div key={idx} className="card p-4 flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 rounded-md bg-ibc-red/10 text-ibc-red flex items-center justify-center font-bold">{idx+1}</div>
              <div>
                <div className="font-semibold text-ibc-blue">{it}</div>
                <div className="text-sm text-gray-600">Deskripsi singkat tentang {it.toLowerCase()}.</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

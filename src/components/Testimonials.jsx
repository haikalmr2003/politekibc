import React from "react";
import { motion } from "framer-motion";

/**
 * Simple testimonials section. Expects avatars inside /src/assets.
 */
export default function Testimonials({ items }) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-ibc-blue mb-6">Testimoni</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(t => (
            <motion.div key={t.id} className="card p-6"
              whileHover={{ y: -6 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-semibold text-ibc-blue">{t.name}</div>
                  <div className="text-yellow-500">{'★'.repeat(t.rating)}</div>
                </div>
              </div>
              <p className="text-gray-600">{t.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

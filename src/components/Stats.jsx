import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaUserGraduate, FaCertificate, FaCalendarAlt } from "react-icons/fa";

/**
 * Statistics cards with hover lift animation.
 */
const iconMap = {
  FaGraduationCap: <FaGraduationCap className="text-ibc-red w-6 h-6" />,
  FaUserGraduate: <FaUserGraduate className="text-ibc-blue w-6 h-6" />,
  FaCertificate: <FaCertificate className="text-yellow-500 w-6 h-6" />,
  FaCalendarAlt: <FaCalendarAlt className="text-gray-500 w-6 h-6" />
};

export default function Stats({ items }) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((it, idx) => (
            <motion.div
              key={it.id}
              className="card p-6 flex items-center gap-4 card-hover"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-3 rounded-md bg-ibc-light">
                {iconMap[it.icon] ?? <FaGraduationCap className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-sm text-gray-500">{it.label}</div>
                <div className="text-xl font-bold text-ibc-blue">{it.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { FaLaptop, FaFileWord, FaPalette, FaRobot, FaLanguage, FaBriefcase } from "react-icons/fa";

/**
 * Programs grid — 6 cards with big icons and hover animation.
 */
const programIcons = {
  FaLaptop: <FaLaptop className="w-10 h-10" />,
  FaFileWord: <FaFileWord className="w-10 h-10" />,
  FaPalette: <FaPalette className="w-10 h-10" />,
  FaRobot: <FaRobot className="w-10 h-10" />,
  FaLanguage: <FaLanguage className="w-10 h-10" />,
  FaBriefcase: <FaBriefcase className="w-10 h-10" />
};

export default function Programs({ items }) {
  return (
    <section id="program" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-ibc-blue mb-6">Program Kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((p, i) => (
            <motion.div key={p.id}
              className="card p-6 flex flex-col items-start gap-4 hover:shadow-md"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 rounded-md bg-ibc-light text-ibc-red">
                {programIcons[p.icon]}
              </div>
              <h3 className="text-lg font-semibold text-ibc-blue">{p.title}</h3>
              <p className="text-sm text-gray-600">Kelas intensif dengan materi praktis dan tutor berpengalaman.</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

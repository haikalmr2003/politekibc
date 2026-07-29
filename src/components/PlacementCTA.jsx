import React from "react";
import { Link } from "react-router-dom";

/**
 * Small CTA section with blue background for the placement test.
 */
export default function PlacementCTA() {
  return (
    <section className="py-10 bg-ibc-blue text-white">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Cari Tahu Level Kemampuanmu</h3>
          <p className="text-sm text-white/80">Ikuti placement test gratis untuk menilai levelmu dan mendapatkan rekomendasi kelas.</p>
        </div>
        <div>
          <Link to="/placement-test" className="px-5 py-3 bg-white text-ibc-blue rounded-md font-semibold">Mulai Placement Test</Link>
        </div>
      </div>
    </section>
  );
}

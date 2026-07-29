import React from "react";

/**
 * Final CTA with red background and white button.
 */
export default function CTA() {
  return (
    <section className="py-12 bg-ibc-red text-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Siap Menjadi Generasi Digital?</h3>
          <p className="text-white/90 mt-2">Gabung sekarang dan mulai perjalanan karier digitalmu bersama Politek IBC.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <a href="#daftar" className="px-6 py-3 bg-white text-ibc-red rounded-md font-semibold">Daftar Sekarang</a>
        </div>
      </div>
    </section>
  );
}

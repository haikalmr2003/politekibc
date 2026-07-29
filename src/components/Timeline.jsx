import React from "react";

/**
 * A simple 4-step timeline illustrating the learning flow.
 */
export default function Timeline() {
  const steps = ["Daftar", "Placement Test", "Belajar", "Lulus & Sertifikat"];
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-ibc-blue mb-6">Timeline Belajar</h2>
        <div className="relative">
          <div className="border-l-2 border-ibc-blue absolute left-6 top-0 bottom-0" />
          <div className="pl-12">
            {steps.map((s, i) => (
              <div key={i} className="mb-8 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-ibc-red text-white flex items-center justify-center font-bold">{i+1}</div>
                <div>
                  <div className="font-semibold text-ibc-blue text-lg">{s}</div>
                  <div className="text-sm text-gray-600">Deskripsi singkat untuk langkah {s.toLowerCase()}.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

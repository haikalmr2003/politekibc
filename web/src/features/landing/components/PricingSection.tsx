import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface PricingSectionProps {
  onStartTest: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onStartTest }) => {
  return (
    <section id="pricing" className="py-20 bg-slate-50 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-full">
            Biaya Program Transparan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
            Biaya Program POLITEK IBC
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Investasi pendidikan terjangkau dengan kualitas pengajaran berstandar nasional & internasional.
          </p>
        </div>

        {/* 3 Main Pricing Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-12">
          
          {/* Card 1: Program Reguler Bahasa Inggris */}
          <div id="pricing-english" className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between scroll-mt-24">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
                  Bahasa Inggris
                </span>
                <span className="text-xs text-slate-400 font-semibold">CEFR Standard</span>
              </div>
              <h3 className="text-2xl font-extrabold text-blue-950 mb-2">Program Reguler Bahasa Inggris</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-6">
                Pilihan frekuensi belajar fleksibel untuk menguasai Bahasa Inggris dari tingkat Starter hingga Intermediate.
              </p>

              {/* Pricing Table Options */}
              <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-medium text-slate-700">1x Pertemuan / minggu</span>
                  <span className="text-sm font-extrabold text-blue-950">Rp 250.000 <span className="text-[10px] font-normal text-slate-500">/bln</span></span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-medium text-slate-700">2x Pertemuan / minggu</span>
                  <span className="text-sm font-extrabold text-blue-950">Rp 450.000 <span className="text-[10px] font-normal text-slate-500">/bln</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">3x Pertemuan / minggu</span>
                  <span className="text-sm font-extrabold text-blue-950">Rp 650.000 <span className="text-[10px] font-normal text-slate-500">/bln</span></span>
                </div>
              </div>

              <div className="space-y-2.5 mb-8 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Level Starter, Beginner, Elementary & Intermediate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pengajar berpengalaman & kurikulum terstruktur</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Placement Test & Sertifikat Resmi</span>
                </div>
              </div>
            </div>

            <button
              onClick={onStartTest}
              className="w-full py-3.5 px-4 rounded-xl border border-blue-950 text-blue-950 hover:bg-blue-50 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Daftar Bahasa Inggris</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Program Reguler Komputer */}
          <div id="pricing-komputer" className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between scroll-mt-24">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 uppercase tracking-wider">
                  Komputer Praktis
                </span>
                <span className="text-xs text-slate-400 font-semibold">Siap Kerja</span>
              </div>
              <h3 className="text-2xl font-extrabold text-blue-950 mb-2">Program Reguler Komputer</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-6">
                Keterampilan digital & aplikasi perkantoran terpenting untuk menunjang pekerjaan dan pendidikan modern.
              </p>

              {/* Pricing Table Options */}
              <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-medium text-slate-700">1x Pertemuan / minggu</span>
                  <span className="text-sm font-extrabold text-blue-950">Rp 300.000 <span className="text-[10px] font-normal text-slate-500">/bln</span></span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-medium text-slate-700">2x Pertemuan / minggu</span>
                  <span className="text-sm font-extrabold text-blue-950">Rp 450.000 <span className="text-[10px] font-normal text-slate-500">/bln</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">3x Pertemuan / minggu</span>
                  <span className="text-sm font-extrabold text-blue-950">Rp 650.000 <span className="text-[10px] font-normal text-slate-500">/bln</span></span>
                </div>
              </div>

              <div className="space-y-2.5 mb-8 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Computer Basic & Office Productivity (Word, Excel, PPT)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Digital Productivity & Career Ready Skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Praktik langsung di Lab Komputer & Sertifikat</span>
                </div>
              </div>
            </div>

            <button
              onClick={onStartTest}
              className="w-full py-3.5 px-4 rounded-xl border border-blue-950 text-blue-950 hover:bg-blue-50 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Daftar Kelas Komputer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Program Super Intensif */}
          <div id="pricing-super-intensif" className="bg-white rounded-2xl p-8 border border-red-600 shadow-2xl ring-2 ring-red-600/20 relative flex flex-col justify-between scroll-mt-24">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>AKSELERASI KILAT</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200 uppercase tracking-wider">
                  Super Akselerasi
                </span>
                <span className="text-xs text-red-600 font-extrabold">30x Pertemuan</span>
              </div>
              <h3 className="text-2xl font-extrabold text-blue-950 mb-2">Program Super Intensif</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-6">
                Ingin belajar lebih cepat? Cocok bagi peserta yang membutuhkan peningkatan kemampuan dalam waktu singkat untuk persiapan sekolah, kuliah, pekerjaan, maupun kebutuhan profesional.
              </p>

              {/* Price Display */}
              <div className="mb-6 p-4 rounded-xl bg-red-50/70 border border-red-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase block">Total Investasi</span>
                  <span className="text-xs text-slate-500 font-medium">30x Pertemuan Pembelajaran</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-red-700">Rp 2.300.000</span>
                </div>
              </div>

              <div className="space-y-2.5 mb-8 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Materi padat & bimbingan terfokus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Jadwal harian / fleksibel sesuai kebutuhan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Sertifikat Hasil Akselerasi Resmi</span>
                </div>
              </div>
            </div>

            <button
              onClick={onStartTest}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Daftar Super Intensif</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Guarantee & Info Banner */}
        <div className="bg-blue-950 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-900">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Biaya Terjangkau & Kualitas Pembelajaran Terbaik</h4>
              <p className="text-slate-300 text-xs mt-0.5">Dapatkan Placement Test gratis & konsultasi program yang paling sesuai dengan tingkat kemampuan Anda.</p>
            </div>
          </div>
          <button
            onClick={onStartTest}
            className="bg-white text-blue-950 hover:bg-blue-50 font-bold text-xs px-5 py-2.5 rounded-xl shrink-0 transition-colors cursor-pointer"
          >
            Konsultasi / Tes Gratis
          </button>
        </div>

      </div>
    </section>
  );
};

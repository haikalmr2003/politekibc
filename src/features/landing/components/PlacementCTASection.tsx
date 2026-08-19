import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Award, Clock, FileCheck } from 'lucide-react';

interface PlacementCTASectionProps {
  onStartTest: () => void;
}

export const PlacementCTASection: React.FC<PlacementCTASectionProps> = ({ onStartTest }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white relative overflow-hidden">
      {/* Background Accent Graphics */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-blue-800/80 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Placement Test Online Gratis</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Ketahui Level Kemampuan Bahasa Inggris Anda dalam <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">15 Menit</span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Ikuti tes penempatan resmi Politek IBC. Dapatkan diagnosa kemampuan berstandar CEFR (A1-C1) secara instan beserta rekomendasi program kelas terbaik tanpa dipungut biaya.
              </p>

              {/* Bullet Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-medium text-slate-200">
                <div className="flex items-center gap-2 justify-center lg:justify-start bg-slate-800/70 p-3 rounded-xl border border-slate-700">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Durasi 80 Menit</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start bg-slate-800/70 p-3 rounded-xl border border-slate-700">
                  <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hasil CEFR Instan</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start bg-slate-800/70 p-3 rounded-xl border border-slate-700">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>100% Bebas Biaya</span>
                </div>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-slate-950/80 p-8 rounded-2xl border border-blue-900 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                <Sparkles className="w-8 h-8 text-amber-200" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Siap Menguji Kemampuan?</h3>
                <p className="text-xs text-slate-400 mt-1">Tanpa perlu registrasi rumit. Mulai tes sekarang.</p>
              </div>

              <button
                onClick={onStartTest}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-sm shadow-xl shadow-red-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Mulai Placement Test Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-400 flex items-center gap-1 justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Terhubung otomatis dengan Tim Konsultan</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

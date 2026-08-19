import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Award, BookOpen, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onStartTest: () => void;
  onExploreCourses: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartTest, onExploreCourses }) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Subtle Gradient Spheres */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>POLITEK IBC • Berdiri Sejak 1985</span>
              <span className="text-blue-400">•</span>
              <span className="text-slate-300">Pengalaman 40+ Tahun</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Tingkatkan Kemampuan, Raih Masa Depan Bersama <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-red-500">POLITEK IBC</span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Lembaga pendidikan dan pelatihan terpercaya membantu ribuan peserta mengembangkan keterampilan <strong>Bahasa Inggris</strong> dan <strong>Komputer</strong> dengan pembelajaran yang praktis, terstruktur, dan sesuai kebutuhan dunia kerja.
            </p>

            {/* Key Benefits Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-xl mx-auto lg:mx-0 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                <span>Pengajar Berpengalaman & Kompeten</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                <span>Bahasa Inggris Berstandar CEFR</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                <span>Pelatihan Komputer Siap Kerja</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                <span>Jadwal Fleksibel & Biaya Terjangkau</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onStartTest}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-base shadow-lg shadow-red-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>Start Placement Test</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreCourses}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-blue-950/80 hover:bg-blue-900/90 text-white font-semibold text-base border border-blue-800 transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span>View Programs</span>
              </button>
            </div>

          </div>

          {/* Right Column: Hero Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden border border-blue-900/80 shadow-2xl bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                  alt="Belajar Bahasa Inggris di Politek IBC"
                  className="w-full h-80 sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                
                {/* Floating Badge 1: CEFR Standard */}
                <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-blue-800 text-xs text-slate-200 flex items-center gap-2.5 shadow-xl">
                  <Award className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-bold text-white">CEFR Standard</div>
                    <div className="text-[10px] text-slate-400">Level A1 hingga C1</div>
                  </div>
                </div>

                {/* Floating Badge 2: Accreditation */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-red-500/30 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-400 font-bold text-xs uppercase tracking-wider">Terakreditasi BAN-PNF</p>
                      <p className="text-base font-extrabold text-white mt-0.5">Grade A Outstanding</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-extrabold text-sm shadow-md">
                      A
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


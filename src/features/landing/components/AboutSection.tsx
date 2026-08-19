import React from 'react';
import { POLITEK_INFO } from '../../../lib/config';
import { Target, Compass, Award, CheckCircle, Shield, Globe, Monitor } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 uppercase tracking-wider">
            Profil Politek IBC
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Lembaga Pendidikan & Pelatihan Terpercaya Sejak 1985
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Berdiri sejak 1985, POLITEK IBC telah menjadi lembaga pendidikan dan pelatihan yang berkomitmen membantu ribuan peserta mengembangkan keterampilan Bahasa Inggris dan Komputer dengan pengalaman lebih dari 40 tahun.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Vision Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Visi Lembaga</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              "{POLITEK_INFO.vision}"
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Misi Utama</h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {POLITEK_INFO.mission.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <Award className="w-8 h-8 text-indigo-600" />
            <h4 className="font-bold text-slate-900 text-base">Kurikulum CEFR</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Mengacu pada Common European Framework of Reference for Languages yang diakui universitas global.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <Globe className="w-8 h-8 text-indigo-600" />
            <h4 className="font-bold text-slate-900 text-base">Interactive Method</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Fokus 70% praktik langsung percakapan interaktif agar siswa cepat percaya diri berbicara.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <Monitor className="w-8 h-8 text-indigo-600" />
            <h4 className="font-bold text-slate-900 text-base">Lab Bahasa Digital</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Fasilitas audio terintegrasi dan sistem tes TOEFL/IELTS dengan software simulasi resmi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            <h4 className="font-bold text-slate-900 text-base">Sertifikat Terakreditasi</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Sertifikat resmi Politek IBC diakui oleh instansi pemerintah, BUMN, dan universitas terkemuka.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

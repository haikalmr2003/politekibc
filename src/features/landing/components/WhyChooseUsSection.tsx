import React from 'react';
import { UserCheck, Users, Calendar, Award } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: Award,
      title: "Berdiri Sejak 1985",
      description: "Dengan pengalaman lebih dari 40 tahun, kami berkomitmen mendampingi ribuan peserta melatih keterampilan Bahasa Inggris dan Komputer.",
      badge: "40+ Tahun Pengalaman"
    },
    {
      icon: UserCheck,
      title: "Pengajar Berpengalaman",
      description: "Instruktur kompeten dan berpengalaman mengajar dengan pendekatan komunikatif, sabar, dan mudah dipahami.",
      badge: "Instruktur Kompeten"
    },
    {
      icon: Calendar,
      title: "Jadwal Fleksibel",
      description: "Pilihan frekuensi 1x, 2x, atau 3x per minggu serta kelas Super Intensif yang dapat disesuaikan dengan aktivitas Anda.",
      badge: "Jadwal Fleksibel"
    },
    {
      icon: Users,
      title: "Cocok Semua Kalangan",
      description: "Program dirancang khusus untuk pelajar, mahasiswa, karyawan, pencari kerja, hingga masyarakat umum.",
      badge: "Inklusif & Aplikatif"
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-slate-50 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full">
            Keunggulan POLITEK IBC
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
            Mengapa Memilih POLITEK IBC?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Sistem pembelajaran praktis, terstruktur, dan aplikatif sesuai dengan kebutuhan dunia pendidikan maupun dunia kerja.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  {/* Icon Header */}
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 mb-6 shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-950 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Tag */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-900">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                    {item.badge}
                  </span>
                  <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    ✓ Terpercaya
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { Monitor, Volume2, Users, BookOpen } from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const facilities = [
    {
      title: 'Lab Bahasa Digital & Audio Practice',
      description: 'Dilengkapi 30 unit komputer dan headset audio definisi tinggi untuk simulasi Listening TOEFL/IELTS.',
      icon: Volume2,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Ruang Kelas Smart AC Ber-Multimedia',
      description: 'Proyektor interaktif, papan tulis pintar, dan penataan tempat duduk melingkar untuk mendorong diskusi.',
      icon: Monitor,
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Native Speaker Guest Sessions',
      description: 'Sesi latihan rutin bersama pengajar penutur asli dari Inggris dan Australia setiap bulan.',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Perpustakaan & Learning Resource Center',
      description: 'Koleksi ratusan buku referensi Cambridge, TOEFL Practice, majalah internasional, dan modul fisik.',
      icon: BookOpen,
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 uppercase tracking-wider">
            Fasilitas Mumpuni
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Lingkungan Belajar Modern untuk Hasil Maksimal
          </h2>
          <p className="text-slate-600 text-sm">
            Politek IBC menyediakan fasilitas pendukung kelas dunia agar proses belajar mengajar terasa nyaman dan efektif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row"
              >
                <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden relative">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="sm:w-3/5 p-6 flex flex-col justify-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{fac.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{fac.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { Star, Quote, Award } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Rian Febrian, S.T.',
      role: 'Penerima Beasiswa LPDP 2026',
      course: 'TOEFL Preparation',
      scoreImprovement: 'TOEFL 440 ➔ 585',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      content: 'Metode pembimbingan TOEFL di Politek IBC sangat terstruktur! Pengajar membongkar trik cepat membedah Structure dan Listening. Dalam waktu 2 bulan, skor saya melesat dari 440 ke 585.'
    },
    {
      name: 'Siti Nurhaliza',
      role: 'Student Master Program (UK)',
      course: 'General English & IELTS Prep',
      scoreImprovement: 'IELTS Overall Band 7.5',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      content: 'Feedback untuk Writing & Speaking benar-benar detail. Poin kohesi dan tata bahasa akademik saya dikoreksi secara intensif. Hasilnya saya berhasil tembus Band 7.5 untuk universitas di Inggris!'
    },
    {
      name: 'Budi Santoso',
      role: 'Senior Software Engineer',
      course: 'English Conversation',
      scoreImprovement: 'Promosi Karir Perusahaan Global',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      content: 'Dulu saya selalu canggung saat berbicara dengan klien asing. Setelah ikut kelas Conversation di Politek IBC, kelancaran dan kepercayaan diri saya meningkat drastis dalam diskusi kerja.'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-block text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
            Apa Kata Alumni Politek IBC?
          </h2>
          <p className="text-slate-600 text-base">
            Pengalaman nyata peserta dan lulusan kursus Politek IBC dalam meningkatkan pencapaian akademis dan karir profesional mereka.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => (
            <div 
              key={idx}
              className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-900 hover:shadow-xl transition-all duration-300 relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-blue-100 group-hover:text-red-100 transition-colors" />
                </div>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  "{testi.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={testi.image}
                  alt={testi.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-red-600 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-blue-950 text-sm truncate">{testi.name}</h4>
                  <p className="text-xs text-slate-500 font-medium truncate">{testi.role}</p>
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    <Award className="w-3 h-3 text-red-600" />
                    <span>{testi.scoreImprovement}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


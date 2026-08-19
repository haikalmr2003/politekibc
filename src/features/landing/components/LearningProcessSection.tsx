import React from 'react';
import { FileSearch, MessageSquare, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

interface LearningProcessSectionProps {
  onStartTest: () => void;
}

export const LearningProcessSection: React.FC<LearningProcessSectionProps> = ({ onStartTest }) => {
  const steps = [
    {
      stepNumber: "01",
      icon: FileSearch,
      title: "Placement Test",
      subtitle: "Tes Level Online Gratis",
      description: "Ikuti tes diagnostik online singkat 15 menit untuk mengukur tata bahasa, kosakata, dan pemahaman Bahasa Inggris Anda secara presisi."
    },
    {
      stepNumber: "02",
      icon: MessageSquare,
      title: "Counseling & Mapping",
      subtitle: "Konsultasi Program",
      description: "Diskusi hasil tes bersama tim akademis untuk memilih program kursus, metode, dan jadwal yang paling cocok dengan target Anda."
    },
    {
      stepNumber: "03",
      icon: BookOpen,
      title: "Interactive Learning",
      subtitle: "Pembelajaran Praktis",
      description: "Belajar interaktif di kelas kelompok kecil bersama pengajar bersertifikat, lengkap dengan modul digital dan akses lab bahasa."
    },
    {
      stepNumber: "04",
      icon: GraduationCap,
      title: "Certification",
      subtitle: "Evaluasi & Sertifikasi",
      description: "Evaluasi akhir tingkat kemampuan dan penerbitan Sertifikat Resmi Politek IBC Terakreditasi BAN-PNF Grade A."
    }
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full">
            Alur Pembelajaran
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
            Learning Process
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            4 langkah terstruktur menuju penguasaan Bahasa Inggris profesional bersama Politek IBC.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-slate-50 rounded-2xl p-7 border border-slate-200 hover:border-blue-900 transition-all duration-300 relative flex flex-col justify-between group hover:shadow-lg"
              >
                <div>
                  {/* Step Number Tag & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-red-600/30 group-hover:text-red-600 transition-colors">
                      {item.stepNumber}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-blue-950 text-white flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6 text-blue-300" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-blue-950 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-red-600 mb-3">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Status */}
                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center text-[11px] font-semibold text-slate-500">
                  <span>Step {index + 1} of 4</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Action Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartTest}
            className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>Mulai Langkah 1: Placement Test Gratis</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
          </button>
        </div>

      </div>
    </section>
  );
};

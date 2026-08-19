import React, { useState } from 'react';
import { BookOpen, Check, ArrowRight, Clock, Award, Users, Star } from 'lucide-react';
import { Course } from '../../../types';

interface ProgramsSectionProps {
  onSelectCourse?: (course: Course) => void;
  onStartPlacementTest: () => void;
}

export const PROGRAM_LIST: Course[] = [
  // --- PROGRAM BAHASA INGGRIS (CEFR Standard) ---
  {
    id: "eng-starter",
    title: "Starter (Pre-A1)",
    code: "ENG-PREA1",
    category: "Bahasa Inggris",
    description: "Program dasar untuk pemula yang belum memiliki kemampuan Bahasa Inggris. Peserta akan belajar kosakata, pengucapan, dan percakapan sederhana sebagai fondasi belajar.",
    durationWeeks: 12,
    totalHours: 36,
    level: "Pre-A1 Pemula",
    price: 300000,
    discountPrice: 250000,
    scheduleOptions: ["1x per minggu", "2x per minggu", "3x per minggu"],
    syllabus: [
      "Pengenalan Kosakata Dasar Sehari-hari",
      "Pengucapan (Pronunciation) & Alphabet",
      "Percakapan Sederhana & Perkenalan Diri",
      "Fondasi Tata Bahasa Basic"
    ],
    features: [
      "Kurikulum Standar CEFR Pre-A1",
      "Pembelajaran Praktis & Ramah Pemula",
      "Modul Panduan Lengkap",
      "Sertifikat Kelulusan Resmi"
    ],
    isPopular: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "eng-beginner",
    title: "Beginner (A1)",
    code: "ENG-A1",
    category: "Bahasa Inggris",
    description: "Membangun kemampuan komunikasi dasar dalam situasi sehari-hari, seperti memperkenalkan diri, bertanya, dan menjawab pertanyaan sederhana.",
    durationWeeks: 12,
    totalHours: 48,
    level: "A1 Beginner",
    price: 300000,
    discountPrice: 250000,
    scheduleOptions: ["1x per minggu", "2x per minggu", "3x per minggu"],
    syllabus: [
      "Komunikasi Situasi Sehari-hari",
      "Tanya Jawab & Expressing Opinions",
      "Basic Reading & Listening Skills",
      "Penyusunan Kalimat Sederhana"
    ],
    features: [
      "Standar CEFR A1 International",
      "Praktik Speaking Interaktif",
      "Bimbingan Pengajar Pengalaman",
      "Sertifikat Resmi POLITEK IBC"
    ],
    isPopular: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "eng-elementary",
    title: "Elementary (A2)",
    code: "ENG-A2",
    category: "Bahasa Inggris",
    description: "Mengembangkan kemampuan berbicara, membaca, menulis, dan mendengarkan untuk kebutuhan akademik maupun kehidupan sehari-hari.",
    durationWeeks: 12,
    totalHours: 48,
    level: "A2 Elementary",
    price: 350000,
    discountPrice: 250000,
    scheduleOptions: ["1x per minggu", "2x per minggu", "3x per minggu"],
    syllabus: [
      "Pengembangan 4 Skill (Speaking, Listening, Reading, Writing)",
      "Kebutuhan Akademik & Sosial",
      "Tata Bahasa Intermediate Intro",
      "Diskusi & Presentasi Singkat"
    ],
    features: [
      "Standar CEFR A2 International",
      "Latihan Praktis Berkelompok",
      "Evaluasi Kemampuan Berkala",
      "Sertifikat Resmi POLITEK IBC"
    ],
    isPopular: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "eng-intermediate",
    title: "Intermediate (B1)",
    code: "ENG-B1",
    category: "Bahasa Inggris",
    description: "Meningkatkan kemampuan berkomunikasi dengan lebih percaya diri dalam lingkungan pendidikan, pekerjaan, maupun aktivitas profesional.",
    durationWeeks: 12,
    totalHours: 48,
    level: "B1 Intermediate",
    price: 400000,
    discountPrice: 250000,
    scheduleOptions: ["1x per minggu", "2x per minggu", "3x per minggu"],
    syllabus: [
      "Komunikasi Profesional & Pekerjaan",
      "Public Speaking & Presentation Skills",
      "Advanced Reading & Writing Mastery",
      "Persiapan Dunia Kerja & Akademik"
    ],
    features: [
      "Standar CEFR B1 International",
      "Diskusi Isu Profesional & Karir",
      "Ujian Simulasi & Sertifikasi",
      "Sertifikat Resmi POLITEK IBC"
    ],
    isPopular: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"
  },

  // --- PROGRAM KOMPUTER ---
  {
    id: "comp-basic",
    title: "Computer Basic",
    code: "COMP-BAS",
    category: "Komputer",
    description: "Belajar dasar-dasar penggunaan komputer, sistem operasi, pengelolaan file, dan internet untuk pemula.",
    durationWeeks: 8,
    totalHours: 24,
    level: "Dasar Pemula",
    price: 300000,
    discountPrice: 300000,
    scheduleOptions: ["1x per minggu", "2x per minggu", "3x per minggu"],
    syllabus: [
      "Pengenalan Komputer & Perangkat Keras",
      "Sistem Operasi Windows & Pengelolaan File",
      "Navigasi Internet & Keamanan Digital Dasar",
      "Penggunaan Email & Layanan Cloud"
    ],
    features: [
      "Akses Lab Komputer Modern",
      "Materi Praktis 80% Hands-on",
      "Bimbingan Pengajar Sabar",
      "Sertifikat Kelulusan Komputer"
    ],
    isPopular: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "office-productivity",
    title: "Office Productivity",
    code: "COMP-OFFICE",
    category: "Komputer",
    description: "Menguasai aplikasi perkantoran seperti Microsoft Word, Excel, dan PowerPoint untuk meningkatkan produktivitas kerja dan tugas sekolah.",
    durationWeeks: 8,
    totalHours: 32,
    level: "Semua Tingkat",
    price: 300000,
    discountPrice: 300000,
    scheduleOptions: ["1x per minggu", "2x per minggu", "3x per minggu"],
    syllabus: [
      "Microsoft Word: Dokumen Resmi, Surat, & Format Laporan",
      "Microsoft Excel: Rumus, Fungsi, & Pengolahan Data",
      "Microsoft PowerPoint: Desain Presentasi Menarik",
      "Integrasi Dokumen Perkantoran Modern"
    ],
    features: [
      "Materi Aplikatif Dunia Kerja",
      "Latihan Studi Kasus Perkantoran",
      "Pengajar Praktisi Komputer",
      "Sertifikat Terakreditasi"
    ],
    isPopular: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "digital-productivity",
    title: "Digital Productivity",
    code: "COMP-DIGITAL",
    category: "Komputer",
    description: "Mengembangkan kemampuan menggunakan berbagai aplikasi digital dan teknologi untuk mendukung pekerjaan serta pembelajaran modern.",
    durationWeeks: 8,
    totalHours: 32,
    level: "Intermediate",
    price: 300000,
    discountPrice: 300000,
    scheduleOptions: ["1x per minggu", "2x per minggu", "3x per minggu"],
    syllabus: [
      "Tools Kolaborasi Cloud (Google Workspace / Office 365)",
      "Pengelolaan Tugas & Project Management Digital",
      "Desain Grafis Dasar & Content Tools",
      "Pemanfaatan AI & Automation untuk Pekerjaan"
    ],
    features: [
      "Materi Tren Teknologi Terbaru",
      "Sistem Praktik Langsung",
      "Studi Kasus Digital Workspace",
      "Sertifikat Kelulusan"
    ],
    isPopular: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "career-ready",
    title: "Career Ready",
    code: "COMP-CAREER",
    category: "Komputer",
    description: "Program persiapan kerja yang membekali peserta dengan keterampilan komputer praktis yang dibutuhkan di dunia profesional.",
    durationWeeks: 10,
    totalHours: 40,
    level: "Lanjutan / Siap Kerja",
    price: 300000,
    discountPrice: 300000,
    scheduleOptions: ["1x per minggu", "2x per minggu", "3x per minggu"],
    syllabus: [
      "Administrasi Perkantoran & Data Entry Pro",
      "Penyusunan Portofolio & CV Digital",
      "Simulasi Ujian Keterampilan Komputer Kerja",
      "Etika & Komunikasi Kerja Profesional"
    ],
    features: [
      "Siap Kerja & Magang",
      "Portofolio Hasil Karya",
      "Sertifikat Kompetensi Kerja",
      "Konsultasi Karir Gratis"
    ],
    isPopular: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
  },

  // --- PROGRAM SUPER INTENSIF ---
  {
    id: "super-intensive",
    title: "Program Super Intensif",
    code: "SUPER-INTENSIVE",
    category: "Super Intensif",
    description: "Program akselerasi cepat total 30 kali pertemuan bagi peserta yang membutuhkan peningkatan kemampuan Bahasa Inggris / Komputer dalam waktu singkat.",
    durationWeeks: 4,
    totalHours: 60,
    level: "Semua Tingkat (Fast Track)",
    price: 2500000,
    discountPrice: 2300000,
    scheduleOptions: ["Setiap Hari (Senin - Jumat)", "30x Pertemuan Intensif"],
    syllabus: [
      "30x Pertemuan Pembelajaran Bimbingan Terfokus",
      "Materi Kombinasi Cepat & Modul Akselerasi",
      "Simulasi Ujian & Evaluasi Harian",
      "Persiapan Sekolah, Kuliah, atau Pekerjaan"
    ],
    features: [
      "Total 30 Kali Pertemuan Bimbingan",
      "Progress Hasil Belajar Kilat",
      "Pengajar Khusus Super Intensif",
      "Sertifikat Resmi Akselerasi"
    ],
    isPopular: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80"
  }
];

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onSelectCourse, onStartPlacementTest }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredPrograms = selectedCategory === 'All' 
    ? PROGRAM_LIST 
    : PROGRAM_LIST.filter(p => p.category === selectedCategory);

  return (
    <section id="programs" className="py-20 bg-white relative border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Program Kursus Unggulan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
              Programs
            </h2>
            <p className="text-slate-600 text-base mt-2 max-w-2xl">
              Pilihan program kursus bahasa Inggris terstruktur yang dirancang sesuai kebutuhan akademis dan profesional Anda.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['All', 'Bahasa Inggris', 'Komputer', 'Super Intensif'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? 'Semua Program' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program) => (
            <div 
              key={program.id}
              className={`bg-white rounded-2xl border ${
                program.isPopular ? 'border-red-500 shadow-xl ring-2 ring-red-500/20' : 'border-slate-200 shadow-xs'
              } overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300 relative group`}
            >
              {/* Popular Badge */}
              {program.isPopular && (
                <div className="absolute top-4 right-4 z-10 bg-red-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div>
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={program.thumbnailUrl} 
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="bg-blue-900/90 backdrop-blur-md px-2.5 py-1 rounded-md text-white border border-blue-700">
                      Level: {program.level}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
                    {program.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-6">
                    {program.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-6 pt-0 border-t border-slate-100 mt-auto">
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => {
                      let targetId = 'pricing-english';
                      if (program.category === 'Komputer' || program.id.startsWith('comp') || program.id === 'office-productivity') {
                        targetId = 'pricing-komputer';
                      } else if (program.category === 'Super Intensif' || program.id === 'super-intensive') {
                        targetId = 'pricing-super-intensif';
                      }
                      const pricingEl = document.getElementById(targetId) || document.getElementById('pricing');
                      if (pricingEl) {
                        pricingEl.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.hash = `#${targetId}`;
                      }
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-blue-900 text-blue-900 hover:bg-blue-50 font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    Detail Program
                  </button>

                  <button
                    onClick={onStartPlacementTest}
                    className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1"
                  >
                    <span>Ikuti Tes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

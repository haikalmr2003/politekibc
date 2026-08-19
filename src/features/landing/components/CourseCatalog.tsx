import React, { useState, useEffect } from 'react';
import { Course } from '../../../types';
import { DatabaseService } from '../../../services/database.service';
import { Clock, Tag, Check, ArrowRight, Star, Sparkles } from 'lucide-react';

interface CourseCatalogProps {
  onSelectCourse: (course: Course) => void;
  onStartPlacementTest: () => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ onSelectCourse, onStartPlacementTest }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'General English', 'Exam Prep', 'Business & Career', 'Speaking & Conversation', 'Kids & Teens'];

  useEffect(() => {
    DatabaseService.getCourses().then((data) => {
      setCourses(data);
    });
  }, []);

  const filteredCourses = selectedCategory === 'Semua' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-block text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
            Pilihan Program Kursus
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Program Pembelajaran Terbaik Sesuai Kebutuhan Anda
          </h2>
          <p className="text-slate-600 text-sm">
            Temukan kursus yang dirancang khusus untuk mempercepat penguasaan Bahasa Inggris Anda dari tingkat pemula hingga tingkat lanjut.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm">
            Belum ada program kursus tersedia untuk kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div 
                key={course.id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col overflow-hidden relative"
              >
                {/* Image & Popular Badge */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700">
                    {course.category}
                  </span>

                  {course.isPopular && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-slate-950" />
                      Paling Diminati
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 text-amber-300 text-xs font-medium flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{course.level}</span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {course.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => {
                        let targetId = 'pricing-english';
                        if (course.category === 'Komputer' || course.id.startsWith('comp') || course.id === 'office-productivity') {
                          targetId = 'pricing-komputer';
                        } else if (course.category === 'Super Intensif' || course.id === 'super-intensive') {
                          targetId = 'pricing-super-intensif';
                        }
                        const pricingEl = document.getElementById(targetId) || document.getElementById('pricing');
                        if (pricingEl) {
                          pricingEl.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          window.location.hash = `#${targetId}`;
                        }
                      }}
                      className="px-4 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Detail Program & Biaya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Placement CTA banner inside catalog */}
        <div className="mt-16 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-800">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Bingung Memilih Program Kursus yang Tepat?</h3>
            <p className="text-indigo-200 text-xs sm:text-sm max-w-xl">
              Ikuti Placement Test Online Politek IBC secara gratis! Dapatkan rekomendasi tingkat dan evaluasi kemampuan Bahasa Inggris Anda secara presisi.
            </p>
          </div>
          <button
            onClick={onStartPlacementTest}
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow-lg flex items-center gap-2 cursor-pointer transition-transform transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Mulai Tes Placement Sekarang</span>
          </button>
        </div>

      </div>
    </section>
  );
};

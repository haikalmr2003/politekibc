import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara mendaftar dan mengikuti Placement Test di Politek IBC?',
      a: 'Pendaftaran sangat mudah! Anda dapat menekan tombol "Start Placement Test" di bagian header atau banner website ini. Tes penempatan online gratis berlangsung 15-20 menit dan hasil CEFR beserta rekomendasi kelas langsung tersedia.'
    },
    {
      q: 'Apakah Placement Test Online Politek IBC benar-benar gratis?',
      a: 'Ya, 100% GRATIS tanpa biaya tersembunyi. Anda tidak perlu memasukkan kartu kredit atau melakukan pembayaran untuk mengikuti tes diagnostik awal.'
    },
    {
      q: 'Berapa lama durasi program kursus dan bagaimana pilihan jadwalnya?',
      a: 'Durasi kursus bervariasi dari 8 hingga 12 minggu. Kami menyediakan pilihan kelas Reguler (Pagi/Sore), Kelas Malam (18.30-20.30 WIB), dan Kelas Weekend (Sabtu/Minggu).'
    },
    {
      q: 'Apakah sertifikat dari Politek IBC diakui secara resmi?',
      a: 'Ya, Politek IBC terakreditasi Grade A oleh BAN-PNF. Sertifikat kelulusan diakui secara resmi oleh instansi pemerintah, BUMN, perusahaan swasta, dan institusi akademik.'
    },
    {
      q: 'Apakah ada garansi peningkatan skor untuk TOEFL / IELTS Preparation?',
      a: 'Ya! Kami memberikan garansi pengulangan kelas gratis jika siswa memenuhi tingkat kehadiran minimal 90% namun belum mencapai target skor minimum.'
    },
    {
      q: 'Bagaimana jika saya ingin berkonsultasi langsung mengenai program kelas?',
      a: 'Anda dapat langsung menekan tombol "Hubungi WhatsApp" yang tersedia. Tim konsultan akademik kami siap melayani dan memberikan rekomendasi kelas terbaik.'
    }
  ];

  const filteredFaqs = faqs.filter(item => 
    item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <span className="inline-block text-xs font-bold text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200 uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-base">
            Jawaban lengkap atas pertanyaan yang sering diajukan seputar pendaftaran, program kursus, dan fasilitas Politek IBC.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari pertanyaan Anda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-xs"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className={`rounded-2xl border ${isOpen ? 'border-blue-900 shadow-md bg-slate-50' : 'border-slate-200 bg-white'} overflow-hidden transition-all duration-200`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 text-left font-bold text-blue-950 text-sm flex items-center justify-between gap-4 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className={`w-4 h-4 ${isOpen ? 'text-red-600' : 'text-blue-900'} shrink-0`} />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-red-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};


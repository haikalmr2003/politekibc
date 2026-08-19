import React, { useState } from 'react';
import { Course } from '../../../types';
import { POLITEK_INFO } from '../../../lib/config';
import { X, MessageCircle, CheckCircle2, BookOpen } from 'lucide-react';

interface RegistrationModalProps {
  course: Course | null;
  onClose: () => void;
  onStartTest: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ course, onClose, onStartTest }) => {
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(course?.scheduleOptions[0] || '');

  if (!course) return null;

  const handleWhatsAppRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Halo Admin Politek IBC, saya ingin berkonsultasi / mendaftar program kursus:
- *Program*: ${course.title}
- *Nama*: ${studentName || 'Calon Siswa'}
- *No. WhatsApp*: ${phone || '-'}
- *Pilihan Jadwal*: ${selectedSchedule || 'Konsultasi Dulu'}

Mohon informasi rincian pendaftaran dan metode pembayaran. Terima kasih!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${POLITEK_INFO.whatsappNumber}?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <span className="inline-block text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20 mb-2">
            {course.category}
          </span>
          <h3 className="text-xl font-bold">{course.title}</h3>
          <p className="text-xs text-slate-300 mt-1">{course.level} • {course.duration}</p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
          
          {/* Syllabus / Features Overview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Fasilitas & Layanan Program:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              {course.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleWhatsAppRegister} className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Contoh: Rian Febrian"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Nomor WhatsApp / HP</label>
              <input
                type="tel"
                required
                placeholder="Contoh: 08211409313"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Pilih Opsi Jadwal Kelas</label>
              <select
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {course.scheduleOptions.map((sch, i) => (
                  <option key={i} value={sch}>{sch}</option>
                ))}
              </select>
            </div>

            {/* Price note */}
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
              <span className="text-amber-900 font-medium">Investasi Pendidikan:</span>
              <span className="text-base font-extrabold text-amber-700">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(course.discountPrice || course.price)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Daftar / Konsultasi via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartTest();
                }}
                className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                Tes Level Dulu
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

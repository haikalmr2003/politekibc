import React, { useState } from 'react';
import { PlacementTestResult, StudentProfile, PaymentRecord } from '../../../types';
import { isSupabaseConfigured } from '../../../services/database.service';
import { 
  Users, 
  Laptop, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  GraduationCap, 
  XCircle, 
  Database, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  MessageCircle, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

interface AdminOverviewProps {
  testResults: PlacementTestResult[];
  students: StudentProfile[];
  payments: PaymentRecord[];
  onNavigateTab?: (tab: 'students' | 'payments') => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ 
  testResults, 
  students, 
  payments,
  onNavigateTab 
}) => {
  const [showEstimationModal, setShowEstimationModal] = useState(false);

  // 1. Calculations for Students
  const activeStudents = students.filter(s => s.status === 'active');
  const activeCount = activeStudents.length;

  const computerStudents = activeStudents.filter(s => s.program === 'computer' || s.enrolledCourse?.toLowerCase().includes('komputer'));
  const englishStudents = activeStudents.filter(s => s.program === 'english' || (!s.program && !s.enrolledCourse?.toLowerCase().includes('komputer')));

  const graduatedCount = students.filter(s => s.status === 'graduated').length;
  const inactiveCount = students.filter(s => s.status === 'inactive').length;

  // 2. Package Pricing Breakdown for Next Month Revenue Estimation
  // Prices: Basic = Rp 250.000, Regular = Rp 450.000, Intensive = Rp 650.000
  const basicActive = activeStudents.filter(s => s.package === 'basic');
  const regularActive = activeStudents.filter(s => s.package === 'regular' || (!s.package && s.enrolledCourse !== 'Super Intensif'));
  const intensiveActive = activeStudents.filter(s => s.package === 'intensive' || s.enrolledCourse === 'Super Intensif');

  const basicPrice = 250000;
  const regularPrice = 450000;
  const intensivePrice = 650000;

  const basicTotalRev = basicActive.length * basicPrice;
  const regularTotalRev = regularActive.length * regularPrice;
  const intensiveTotalRev = intensiveActive.length * intensivePrice;

  const nextMonthEstimation = basicTotalRev + regularTotalRev + intensiveTotalRev;

  // 3. Payments Calculations
  const currentMonthStr = new Date().toISOString().substring(0, 7); // YYYY-MM
  const paidCurrentMonth = payments.filter(p => p.paymentStatus === 'paid' && p.billingMonth.startsWith(currentMonthStr));
  const currentMonthRevenue = paidCurrentMonth.reduce((sum, p) => sum + p.amount, 0);

  const unpaidPayments = payments.filter(p => p.paymentStatus !== 'paid');
  const unpaidCount = unpaidPayments.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const overduePayments = payments.filter(p => p.paymentStatus !== 'paid' && p.dueDate < todayStr);

  // Format currency Helper
  const formatRp = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-8">
      {/* 8 Primary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Total Siswa Aktif */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa Aktif</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">{activeCount}</p>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
              📚 Berjalan Aktif
            </span>
          </div>
        </div>

        {/* Card 2: Siswa Komputer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa Komputer</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Laptop className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-blue-700">{computerStudents.length}</p>
            <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
              👨‍💻 Kelas Komputer
            </span>
          </div>
        </div>

        {/* Card 3: Siswa Inggris */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa B. Inggris</span>
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-red-600">{englishStudents.length}</p>
            <span className="text-[11px] text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full inline-block mt-1">
              🇬🇧 English Course
            </span>
          </div>
        </div>

        {/* Card 4: Pendapatan Bulan Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendapatan Bulan Ini</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-700">{formatRp(currentMonthRevenue)}</p>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              💰 Terbayar ({paidCurrentMonth.length} Transaksi)
            </span>
          </div>
        </div>

        {/* Card 5: Estimasi Pendapatan Bulan Depan */}
        <div 
          onClick={() => setShowEstimationModal(true)}
          className="bg-gradient-to-br from-indigo-900 to-slate-900 p-5 rounded-2xl border border-indigo-800 text-white shadow-md hover:shadow-lg transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              Estimasi Bulan Depan
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-300">{formatRp(nextMonthEstimation)}</p>
            <p className="text-[11px] text-indigo-200 mt-1 flex items-center gap-1">
              📈 Dari {activeCount} Siswa Aktif <ChevronRight className="w-3 h-3 text-indigo-400" />
            </p>
          </div>
        </div>

        {/* Card 6: Belum Bayar */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('payments')}
          className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Belum Bayar / Telat</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-amber-600">{unpaidCount}</p>
            <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">
              ⏰ {overduePayments.length} Telat Jatuh Tempo
            </span>
          </div>
        </div>

        {/* Card 7: Lulus */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa Lulus</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-purple-700">{graduatedCount}</p>
            <span className="text-[11px] text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full inline-block mt-1">
              🎓 Alumni Terakreditasi
            </span>
          </div>
        </div>

        {/* Card 8: Nonaktif */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa Nonaktif</span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-600">{inactiveCount}</p>
            <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">
              ❌ Cuti / Berhenti
            </span>
          </div>
        </div>

      </div>

      {/* Rincian Kalkulasi Estimasi Pendapatan Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Kalkulator Automatis
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">Estimasi Pendapatan Bulan Depan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dihitung otomatis berdasarkan jumlah siswa aktif per paket (Siswa Nonaktif/Lulus otomatis tidak ikut dihitung).
            </p>
          </div>
          <button
            onClick={() => setShowEstimationModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Rincian Detail Paket</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Paket Basic</span>
              <span className="text-indigo-600 font-mono">Rp 250.000 / bln</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{basicActive.length} Siswa</p>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-xs">
              <span className="text-slate-500">Subtotal:</span>
              <span className="font-extrabold text-slate-800">{formatRp(basicTotalRev)}</span>
            </div>
          </div>

          <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-indigo-900">
              <span>Paket Regular</span>
              <span className="text-indigo-700 font-mono">Rp 450.000 / bln</span>
            </div>
            <p className="text-2xl font-black text-indigo-900">{regularActive.length} Siswa</p>
            <div className="pt-2 border-t border-indigo-200/60 flex justify-between text-xs">
              <span className="text-indigo-600">Subtotal:</span>
              <span className="font-extrabold text-indigo-900">{formatRp(regularTotalRev)}</span>
            </div>
          </div>

          <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-amber-900">
              <span>Paket Intensive</span>
              <span className="text-amber-800 font-mono">Rp 650.000 / bln</span>
            </div>
            <p className="text-2xl font-black text-amber-900">{intensiveActive.length} Siswa</p>
            <div className="pt-2 border-t border-amber-200 flex justify-between text-xs">
              <span className="text-amber-700">Subtotal:</span>
              <span className="font-extrabold text-amber-900">{formatRp(intensiveTotalRev)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Estimasi Pemasukan Bulan Depan</span>
            <p className="text-xs text-indigo-300 font-semibold mt-0.5">
              Formulasi: ({basicActive.length} Basic × 250k) + ({regularActive.length} Regular × 450k) + ({intensiveActive.length} Intensive × 650k)
            </p>
          </div>
          <span className="text-2xl font-black text-amber-400 shrink-0">{formatRp(nextMonthEstimation)}</span>
        </div>
      </div>

      {/* Perhatian Telat Bayar Section */}
      {overduePayments.length > 0 && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h4 className="font-bold text-rose-900 text-sm">Peringatan: {overduePayments.length} Pembayaran Telat Jatuh Tempo</h4>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('payments')}
              className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
            >
              Kelola di Tab Pembayaran →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {overduePayments.slice(0, 4).map(p => {
              const student = students.find(s => s.id === p.studentId);
              return (
                <div key={p.id} className="p-3 bg-white rounded-xl border border-rose-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{student?.fullName || p.studentName || 'Siswa'}</span>
                    <span className="text-slate-400 block text-[10px]">Jatuh Tempo: {p.dueDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-rose-600 block">{formatRp(p.amount)}</span>
                    <a
                      href={`https://wa.me/${(student?.whatsapp || p.studentWhatsapp || '08211409313').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${student?.fullName || 'Siswa'}, pengingat tagihan SPP Politek IBC bulan ${p.billingMonth} sebesar ${formatRp(p.amount)} telah melewati jatuh tempo (${p.dueDate}). Mohon lakukan pembayaran.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded hover:bg-emerald-100 transition-colors mt-0.5"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Ingatkan WA
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Detail Breakdown Estimasi */}
      {showEstimationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Simulasi Rincian Pendapatan</span>
                <h3 className="text-lg font-black text-slate-900">Kalkulasi Pendapatan Bulan Depan</h3>
              </div>
              <button 
                onClick={() => setShowEstimationModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Kalkulasi ini menghitung estimasi pendapatan secara otomatis berdasarkan data riil paket siswa berstatus <strong>AKTIF</strong> yang ada di Supabase database.
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 font-mono">
                <div className="flex justify-between items-center">
                  <span>{basicActive.length} Paket Basic × Rp 250.000</span>
                  <span className="font-bold text-slate-900">{formatRp(basicTotalRev)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{regularActive.length} Paket Regular × Rp 450.000</span>
                  <span className="font-bold text-slate-900">{formatRp(regularTotalRev)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{intensiveActive.length} Paket Intensive × Rp 650.000</span>
                  <span className="font-bold text-slate-900">{formatRp(intensiveTotalRev)}</span>
                </div>
                <div className="pt-3 border-t border-slate-300 flex justify-between items-center text-sm font-sans font-black text-indigo-700">
                  <span>Estimasi Total:</span>
                  <span className="text-emerald-600">{formatRp(nextMonthEstimation)}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-snug">
                ℹ️ <strong>Aturan Otomatis:</strong> Siswa yang berstatus <em>Lulus</em> ({graduatedCount}) atau <em>Nonaktif/Cuti</em> ({inactiveCount}) secara otomatis dikecualikan dari kalkulasi ini.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowEstimationModal(false)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

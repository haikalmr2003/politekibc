import React, { useState, useEffect } from 'react';
import { PlacementTestResult, StudentProfile, PlacementQuestion, PaymentRecord } from '../../types';
import { DatabaseService, isSupabaseConfigured } from '../../services/database.service';
import { getPlacementQuestions, getAllPlacementQuestions } from '../../services/placement.service';
import { AdminOverview } from './components/AdminOverview';
import { AdminStudents } from './components/AdminStudents';
import { AdminPlacementTests } from './components/AdminPlacementTests';
import { AdminPayments } from './components/AdminPayments';
import { AdminQuestionBank } from './components/AdminQuestionBank';
import { AdminSettings } from './components/AdminSettings';
import { 
  Users, 
  FileText, 
  RefreshCw, 
  HelpCircle,
  LayoutDashboard,
  DollarSign,
  Settings,
  AlertTriangle,
  Database
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'students' | 'payments' | 'questions' | 'settings'>('overview');
  
  const [testResults, setTestResults] = useState<PlacementTestResult[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [selectedResult, setSelectedResult] = useState<PlacementTestResult | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const resultsData = await DatabaseService.getTestResults();
      const studentsData = await DatabaseService.getStudents();
      const paymentsData = await DatabaseService.getPayments();
      const questionsData = await getAllPlacementQuestions();

      setTestResults(resultsData);
      setStudents(studentsData);
      setPayments(paymentsData);
      setQuestions(questionsData);
    } catch (err: any) {
      console.error("Admin load error from Supabase:", err);
      setDbError(err?.message || 'Gagal memuat data dari database Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: PlacementTestResult['status']) => {
    try {
      await DatabaseService.updateTestResultStatus(id, newStatus);
      setTestResults(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      if (selectedResult && selectedResult.id === id) {
        setSelectedResult(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      alert("Gagal memperbarui status di Supabase: " + err?.message);
    }
  };

  const handleDeleteTestResult = async (id: string, studentName: string) => {
    try {
      await DatabaseService.deleteTestResult(id);
      setTestResults(prev => prev.filter(item => item.id !== id));
      if (selectedResult && selectedResult.id === id) {
        setSelectedResult(null);
      }
    } catch (err: any) {
      alert("Gagal menghapus hasil test: " + err?.message);
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header Banner */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded border border-indigo-500/30">
                ADMINISTRATION PANEL
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                isSupabaseConfigured ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                <Database className="w-3 h-3" />
                {isSupabaseConfigured ? 'Database: Supabase Active' : 'Database: Supabase Unconfigured'}
              </span>
            </div>
            <h2 className="text-2xl font-bold">Dashboard Admin Politek IBC</h2>
            <p className="text-xs text-slate-400">
              Kelola hasil Placement Test, data peserta, dan bank soal online secara terpusat dari database Supabase.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAdminData}
              disabled={loading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data Supabase</span>
            </button>
          </div>
        </div>

        {/* Error State Banner */}
        {dbError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Koneksi Database Supabase Tidak Tersedia</span>
            </div>
            <p className="text-rose-700">
              {dbError}. Pastikan variabel lingkungan <code className="bg-rose-100 px-1 font-mono rounded">NEXT_PUBLIC_SUPABASE_URL</code> dan <code className="bg-rose-100 px-1 font-mono rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> sudah aktif di sistem.
            </p>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'tests'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Placement Tests ({testResults.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'students'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Siswa ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Pembayaran</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Bank Soal ({questions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan</span>
          </button>
        </div>

        {/* Tab Modules */}
        {activeTab === 'overview' && (
          <AdminOverview
            testResults={testResults}
            students={students}
            payments={payments}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'tests' && (
          <AdminPlacementTests
            testResults={testResults}
            onStatusChange={handleStatusChange}
            onSelectResult={(res) => setSelectedResult(res)}
            onDeleteResult={handleDeleteTestResult}
          />
        )}

        {activeTab === 'students' && (
          <AdminStudents students={students} onRefresh={loadAdminData} />
        )}

        {activeTab === 'payments' && (
          <AdminPayments />
        )}

        {activeTab === 'questions' && (
          <AdminQuestionBank questions={questions} onRefresh={loadAdminData} />
        )}

        {activeTab === 'settings' && (
          <AdminSettings onRefreshData={loadAdminData} />
        )}

        {/* Result Detail Modal */}
        {selectedResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Hasil Placement Test</span>
                  <h3 className="font-bold text-slate-900 text-lg">{selectedResult.studentName}</h3>
                </div>
                <button onClick={() => setSelectedResult(null)} className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer">✕</button>
              </div>

              {/* Biodata Section */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">WhatsApp</span>
                  <span className="font-semibold text-slate-800">{selectedResult.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Email</span>
                  <span className="font-semibold text-slate-800">{selectedResult.email || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pendidikan Terakhir</span>
                  <span className="font-semibold text-slate-800">{selectedResult.education || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tujuan Belajar</span>
                  <span className="font-semibold text-slate-800">{selectedResult.learningGoal || '-'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Pilihan Program</span>
                  <span className="font-semibold text-indigo-700">{selectedResult.targetProgram || '-'}</span>
                </div>
              </div>

              {/* Scores & CEFR Level */}
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-indigo-100">
                  <span className="font-bold text-indigo-900">Ringkasan Hasil Placement Test:</span>
                  <span className="text-xs text-indigo-600 font-semibold">Tersimpan di Supabase</span>
                </div>

                {/* Benar / Salah / Total Nilai Badge Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase block">Soal Benar</span>
                    <span className="text-lg font-black text-emerald-700">{selectedResult.scores.total}</span>
                    <span className="text-[9px] text-emerald-600 block">Soal</span>
                  </div>
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                    <span className="text-[10px] text-rose-600 font-semibold uppercase block">Soal Salah</span>
                    <span className="text-lg font-black text-rose-700">{Math.max(0, (selectedResult.scores.maxTotal || 0) - (selectedResult.scores.total || 0))}</span>
                    <span className="text-[9px] text-rose-600 block">Soal</span>
                  </div>
                  <div className="p-2.5 bg-indigo-100 border border-indigo-300 rounded-xl">
                    <span className="text-[10px] text-indigo-800 font-semibold uppercase block">Nilai Akhir</span>
                    <span className="text-lg font-black text-indigo-800">{Math.round((selectedResult.scores.total / (selectedResult.scores.maxTotal || 1)) * 100)}</span>
                    <span className="text-[9px] text-indigo-600 block">/ 100 ({Math.round((selectedResult.scores.total / (selectedResult.scores.maxTotal || 1)) * 100)}%)</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Grammar</span>
                    <span className="font-bold text-slate-800">{selectedResult.scores.grammar}/{selectedResult.scores.maxGrammar}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Vocabulary</span>
                    <span className="font-bold text-slate-800">{selectedResult.scores.vocabulary}/{selectedResult.scores.maxVocabulary}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Reading</span>
                    <span className="font-bold text-slate-800">{selectedResult.scores.reading}/{selectedResult.scores.maxReading}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Listening</span>
                    <span className="font-bold text-slate-800">{selectedResult.scores.listening}/{selectedResult.scores.maxListening}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-indigo-100 flex items-center justify-between">
                  <span className="text-slate-600">Rekomendasi Level CEFR:</span>
                  <span className="font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                    {selectedResult.recommendedLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Program Kursus Direkomendasikan:</span>
                  <span className="font-bold text-slate-900">{selectedResult.recommendedCourse}</span>
                </div>
              </div>

              {/* Essay Answer */}
              {selectedResult.essayAnswer && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">Jawaban Writing / Essay Siswa:</span>
                  <p className="italic text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    "{selectedResult.essayAnswer}"
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    const text = `Halo Kak ${selectedResult.studentName}, hasil Placement Test Politek IBC Kakak adalah ${selectedResult.recommendedLevel}. Berikut link pendaftaran kelas: ${window.location.origin}`;
                    window.open(`https://wa.me/${selectedResult.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Kirim Pesan WA ke Siswa
                </button>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

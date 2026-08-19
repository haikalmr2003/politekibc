import React, { useState, useEffect, useRef } from 'react';
import { PlacementQuestion, PlacementTestResult, StudentBiodata, TestSubjectCategory } from '../../../types';
import { DatabaseService, isSupabaseConfigured } from '../../../services/database.service';
import { getPlacementQuestions } from '../../../services/placement.service';
import { TestResultCard } from './TestResultCard';
import { calculateSectionScores, determineCEFRMapping, generateDiagnosticAIReport } from '../utils/scoringEngine';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Volume2, 
  User, 
  Mail, 
  Phone,
  GraduationCap,
  Target,
  Compass,
  AlertTriangle,
  Check,
  Send,
  Database,
  RefreshCw,
  FileQuestion,
  HelpCircle,
  Laptop
} from 'lucide-react';

interface PlacementTestRunnerProps {
  onGoToCourses: () => void;
}

const TOTAL_DURATION_SECONDS = 80 * 60; // 80 Menit

export const PlacementTestRunner: React.FC<PlacementTestRunnerProps> = ({ onGoToCourses }) => {
  const [step, setStep] = useState<'info' | 'test' | 'result'>('info');
  const [selectedSubject, setSelectedSubject] = useState<TestSubjectCategory>('B.inggris');
  
  // Student Biodata Form State
  const [biodata, setBiodata] = useState<StudentBiodata>({
    studentName: '',
    email: '',
    phone: '',
    education: 'SD / MI',
    learningGoal: 'Pendidikan & Akademik',
    targetProgram: 'Bahasa Inggris - Starter (Pre-A1)'
  });

  // Test Runner State
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [essayAnswer, setEssayAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_DURATION_SECONDS);
  const [finalResult, setFinalResult] = useState<PlacementTestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Submit confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadQuestionsFromSupabase(selectedSubject);
  }, [selectedSubject]);

  const loadQuestionsFromSupabase = async (subject: TestSubjectCategory = selectedSubject) => {
    setFetching(true);
    setDbError(null);
    try {
      const data = await getPlacementQuestions(30, subject);
      setQuestions(data);
    } catch (err: any) {
      console.error("Supabase load error:", err);
      setDbError(err?.message || 'Gagal terhubung ke database Supabase.');
    } finally {
      setFetching(false);
    }
  };

  // Timer Effect when in 'test' step
  useEffect(() => {
    if (step === 'test') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, questions, userAnswers, essayAnswer, biodata]);

  const handleStartTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biodata.studentName || !biodata.phone) return;
    if (dbError || questions.length === 0) return;
    setStep('test');
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setSubmitError(null);
    setShowConfirmModal(false);

    const scores = calculateSectionScores(questions, userAnswers);
    const { cefrLevel, recommendedLevel, recommendedCourse, estimatedDuration } = determineCEFRMapping(scores.percentage, selectedSubject);

    const aiReport = generateDiagnosticAIReport(
      biodata.studentName,
      scores,
      biodata.targetProgram,
      essayAnswer,
      selectedSubject
    );

    const payload: Omit<PlacementTestResult, 'id' | 'createdAt' | 'status'> = {
      studentName: biodata.studentName,
      email: biodata.email || `${biodata.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: biodata.phone,
      education: biodata.education,
      learningGoal: biodata.learningGoal,
      targetProgram: biodata.targetProgram,
      subjectCategory: selectedSubject,
      scores: {
        grammar: scores.grammar,
        maxGrammar: scores.maxGrammar,
        vocabulary: scores.vocabulary,
        maxVocabulary: scores.maxVocabulary,
        reading: scores.reading,
        maxReading: scores.maxReading,
        listening: scores.listening,
        maxListening: scores.maxListening,
        total: scores.total,
        maxTotal: scores.maxTotal,
        categoryBreakdown: scores.categoryBreakdown
      },
      cefrLevel,
      recommendedLevel,
      recommendedCourse,
      estimatedDuration,
      essayAnswer,
      answersMap: userAnswers,
      aiAnalysis: aiReport
    };

    try {
      // Direct save to Supabase via Service Layer
      const savedResult = await DatabaseService.saveTestResult(payload);
      setFinalResult(savedResult);
      setStep('result');
    } catch (err: any) {
      console.error("Failed to save placement result into Supabase", err);
      setSubmitError(err?.message || 'Gagal menyimpan hasil placement test ke database Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalAnswered = Object.keys(userAnswers).length + (essayAnswer.trim().length > 0 ? 1 : 0);

  if (step === 'result' && finalResult) {
    return (
      <div className="py-12 bg-slate-50 min-h-screen px-4">
        <TestResultCard 
          result={finalResult} 
          onRetake={() => {
            setStep('info');
            setUserAnswers({});
            setEssayAnswer('');
            setCurrentIdx(0);
            setTimeLeft(TOTAL_DURATION_SECONDS);
          }}
          onGoToCourses={onGoToCourses}
        />
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* 1. Supabase Connection Error State Component */}
        {dbError && (
          <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <Database className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Koneksi Database Supabase Tidak Tersedia</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Sistem membutuhkan database Supabase aktif untuk memuat bank soal & menyimpan biodata peserta. 
                Pastikan variabel <code className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_URL</code> dan <code className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> sudah dikonfigurasi.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-500 text-left max-w-lg mx-auto">
              Error detail: {dbError}
            </div>
            <div className="pt-2">
              <button
                onClick={loadQuestionsFromSupabase}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 mx-auto cursor-pointer transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Coba Muat Ulang Supabase</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Supabase Empty State Component (No Questions) */}
        {!dbError && !fetching && questions.length === 0 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <FileQuestion className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Belum ada soal Placement Test.</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Database Supabase terhubung dengan sukses, namun tabel <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono">placement_questions</code> saat ini belum memiliki data soal. Silakan hubungi admin Politek IBC untuk pengisian bank soal.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={loadQuestionsFromSupabase}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Periksa Lagi</span>
              </button>
              <button
                onClick={onGoToCourses}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Lihat Katalog Program
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {fetching && (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xl text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Memuat data dari database Supabase...</p>
          </div>
        )}

        {/* Step 1: Student Information Form */}
        {!dbError && !fetching && questions.length > 0 && step === 'info' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                <Sparkles className="w-3.5 h-3.5" />
                Supabase Connected • Bank Soal Terintegrasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Placement Test Politek IBC
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                Pilih kategori tes & lengkapi biodata peserta untuk memulai uji diagnostik terintegrasi langsung ke tabel <code className="font-mono bg-slate-100 text-slate-800 px-1 py-0.5 rounded">placement_questions</code> Supabase.
              </p>

              {/* Subject Category Selection Tabs */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Kategori Tes Penempatan:</label>
                <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-2 max-w-md mx-auto border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubject('B.inggris');
                      if (biodata.targetProgram.startsWith('Komputer')) {
                        setBiodata(prev => ({ ...prev, targetProgram: 'Bahasa Inggris - Starter (Pre-A1)' }));
                      }
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedSubject === 'B.inggris'
                        ? 'bg-blue-900 text-white shadow-md ring-2 ring-blue-900/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <span>🇬🇧 B.inggris</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubject('Komputer');
                      if (!biodata.targetProgram.startsWith('Komputer')) {
                        setBiodata(prev => ({ ...prev, targetProgram: 'Komputer - Computer Basic' }));
                      }
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedSubject === 'Komputer'
                        ? 'bg-indigo-900 text-white shadow-md ring-2 ring-indigo-900/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>💻 Komputer</span>
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleStartTestSubmit} className="space-y-4 pt-2">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Febrian"
                    value={biodata.studentName}
                    onChange={(e) => setBiodata(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    Nomor WhatsApp Active *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 08211409313"
                    value={biodata.phone}
                    onChange={(e) => setBiodata(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  Alamat Email (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="Contoh: rian.febrian@gmail.com"
                  value={biodata.email}
                  onChange={(e) => setBiodata(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    Pendidikan Terakhir
                  </label>
                  <select
                    value={biodata.education}
                    onChange={(e) => setBiodata(prev => ({ ...prev, education: e.target.value }))}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="SD / MI">SD / MI</option>
                    <option value="SMP / MTs">SMP / MTs</option>
                    <option value="SMA / SMK / MA">SMA / SMK / MA</option>
                    <option value="D3 / D4 / S1">D3 / D4 / S1</option>
                    <option value="S2 / S3">S2 / S3</option>
                    <option value="Lainnya / Umum">Lainnya / Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    Tujuan Belajar
                  </label>
                  <select
                    value={biodata.learningGoal}
                    onChange={(e) => setBiodata(prev => ({ ...prev, learningGoal: e.target.value }))}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Pendidikan & Akademik">Pendidikan & Akademik</option>
                    <option value="Karir & Kerja Profesional">Karir & Kerja Profesional</option>
                    <option value="Kelancaran Daily Speaking">Kelancaran Daily Speaking</option>
                    <option value="Keterampilan Komputer Praktis">Keterampilan Komputer Praktis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    Pilihan Program
                  </label>
                  <select
                    value={biodata.targetProgram}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBiodata(prev => ({ ...prev, targetProgram: val }));
                      if (val.startsWith('Komputer')) {
                        setSelectedSubject('Komputer');
                      } else {
                        setSelectedSubject('B.inggris');
                      }
                    }}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="Bahasa Inggris - Starter (Pre-A1)">Bahasa Inggris - Starter (Pre-A1)</option>
                    <option value="Bahasa Inggris - Beginner (A1)">Bahasa Inggris - Beginner (A1)</option>
                    <option value="Bahasa Inggris - Elementary (A2)">Bahasa Inggris - Elementary (A2)</option>
                    <option value="Bahasa Inggris - Intermediate (B1)">Bahasa Inggris - Intermediate (B1)</option>
                    <option value="Komputer - Computer Basic">Komputer - Computer Basic</option>
                    <option value="Komputer - Office Productivity">Komputer - Office Productivity</option>
                    <option value="Komputer - Digital Productivity">Komputer - Digital Productivity</option>
                    <option value="Komputer - Career Ready">Komputer - Career Ready</option>
                    <option value="Program Super Intensif (30x)">Program Super Intensif (30x)</option>
                  </select>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Ketentuan Pengerjaan Tes ({selectedSubject === 'Komputer' ? 'Komputer' : 'Bahasa Inggris'}):
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  <li>Durasi waktu <strong>80 Menit</strong> dengan pengerjaan mandiri.</li>
                  <li>Tersedia <strong>{questions.length} Soal {selectedSubject === 'Komputer' ? 'Komputer' : 'Bahasa Inggris'}</strong> yang dimuat langsung dari tabel <code className="font-mono bg-slate-200 text-slate-800 px-1 rounded text-[10px]">placement_questions</code> Supabase.</li>
                  <li>Biodata & hasil skor disimpan secara otomatis ke database Supabase.</li>
                  <li>Rekomendasi kelas & hasil evaluasi diterbitkan secara instan setelah submit.</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Mulai Tes Penempatan {selectedSubject === 'Komputer' ? 'Komputer' : 'Bahasa Inggris'} ({questions.length} Soal)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Test Questions Runner */}
        {!dbError && !fetching && questions.length > 0 && step === 'test' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 relative">
            
            {/* Header progress & Timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Soal {currentIdx + 1} dari {questions.length}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 capitalize flex items-center gap-2">
                  <span>Bagian: {questions[currentIdx]?.category}</span>
                </h3>
              </div>

              {/* 80-Min Countdown Timer */}
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                timeLeft <= 300 
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' 
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}>
                <Clock className={`w-4 h-4 ${timeLeft <= 300 ? 'text-rose-600' : 'text-indigo-600'}`} />
                <span>Sisa Waktu: {formatTimer(timeLeft)}</span>
              </div>
            </div>

            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* 5-Min Warning Notification */}
            {timeLeft <= 300 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Peringatan: Waktu tersisa kurang dari 5 menit! Tes akan otomatis dikirim saat waktu habis.</span>
              </div>
            )}

            {/* Question Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
                <span>Terjawab: {totalAnswered} / {questions.length} Soal</span>
                <span>{Math.round((totalAnswered / questions.length) * 100)}% Selesai</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${(totalAnswered / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Palette / Grid Navigation */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Navigasi Nomor Soal:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {questions.map((q, idx) => {
                  const isCurrent = currentIdx === idx;
                  const isAnswered = q.category === 'essay' ? (essayAnswer.trim().length > 0) : userAnswers[q.id] !== undefined;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-1 shadow-xs'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isAnswered && !isCurrent ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        idx + 1
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Question Body */}
            {questions[currentIdx] && (
              <div className="space-y-4 pt-2">
                
                {/* Passage / Audio if present */}
                {questions[currentIdx].passage && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-serif whitespace-pre-line">
                    {questions[currentIdx].passage}
                  </div>
                )}

                {questions[currentIdx].category === 'listening' && (
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-indigo-600 animate-bounce" />
                      <div>
                        <p className="font-bold text-xs text-indigo-900">Audio Simulation Track</p>
                        <p className="text-[11px] text-indigo-700">Dengarkan simulasi dialog percakapan berikut</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="px-3.5 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-700 cursor-pointer"
                    >
                      {isPlayingAudio ? 'Pause Audio' : 'Play Audio'}
                    </button>
                  </div>
                )}

                {/* Question Text */}
                <div className="text-sm font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                  {questions[currentIdx].questionText}
                </div>

                {/* Multiple Choice Options */}
                {questions[currentIdx].options && (
                  <div className="space-y-2.5 pt-2">
                    {questions[currentIdx].options!.map((opt, optIdx) => {
                      const isSelected = userAnswers[questions[currentIdx].id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(questions[currentIdx].id, optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl text-xs font-medium transition-all flex items-center gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-md font-bold'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                            isSelected ? 'bg-white text-indigo-600' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Essay / Writing Input */}
                {questions[currentIdx].category === 'essay' && (
                  <div className="pt-2 space-y-2">
                    <textarea
                      rows={5}
                      placeholder="Tuliskan paragraf Bahasa Inggris Anda di sini (minimal 3-5 kalimat)..."
                      value={essayAnswer}
                      onChange={(e) => setEssayAnswer(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-[11px] text-slate-400 italic">
                      Jawaban essay Anda akan dinilai langsung oleh AI Evaluator Politek IBC.
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => setShowConfirmModal(true)}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Kirim & Selesai Tes</span>
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 border border-slate-200">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold text-slate-900">Konfirmasi Akhiri Placement Test</h3>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <p>
                  Apakah Anda yakin ingin mengakhiri dan mengirim hasil pengerjaan Placement Test ini langsung ke database Supabase?
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p><strong>Nama Peserta:</strong> {biodata.studentName}</p>
                  <p><strong>Soal Terjawab:</strong> {totalAnswered} dari {questions.length} Soal</p>
                  {totalAnswered < questions.length && (
                    <p className="text-rose-600 font-bold pt-1">
                      ⚠️ Masih terdapat {questions.length - totalAnswered} soal yang belum Anda jawab!
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Kembali Periksa
                </button>
                <button
                  disabled={loading}
                  onClick={handleFinalSubmit}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Menyimpan ke Supabase...' : 'Ya, Submit ke Database'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

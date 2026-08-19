import React, { useEffect, useState } from 'react';
import { PlacementTestResult, AIAnalysisResult } from '../../../types';
import { POLITEK_INFO } from '../../../lib/config';
import politekLogo from '../../../assets/politek_logo.jpg';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle,
  Sparkles, 
  BookOpen, 
  MessageCircle, 
  Download, 
  RotateCcw, 
  Zap, 
  BrainCircuit, 
  GraduationCap, 
  Check,
  Target,
  Send,
  Copy,
  ArrowRight,
  PhoneCall
} from 'lucide-react';

interface TestResultCardProps {
  result: PlacementTestResult;
  onRetake: () => void;
  onGoToCourses: () => void;
}

export const TestResultCard: React.FC<TestResultCardProps> = ({ result, onRetake, onGoToCourses }) => {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(result.aiAnalysis || null);
  const [loadingAi, setLoadingAi] = useState<boolean>(!result.aiAnalysis);

  const subjectName = result.subjectCategory === 'Komputer' ? 'Komputer' : 'Bahasa Inggris';
  const totalQuestions = result.scores.maxTotal || 0;
  const correctCount = result.scores.total || 0;
  const wrongCount = Math.max(0, totalQuestions - correctCount);
  const percentage = Math.round((correctCount / (totalQuestions || 1)) * 100);

  useEffect(() => {
    // Launch celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // If AI analysis wasn't pre-populated, trigger server AI evaluation endpoint
    if (!result.aiAnalysis) {
      fetchAiEvaluation();
    }
  }, []);

  const fetchAiEvaluation = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/evaluate-placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: result.studentName,
          subjectCategory: result.subjectCategory || 'B.inggris',
          scores: result.scores,
          totalQuestions: result.scores.maxTotal,
          essayText: result.essayAnswer || ''
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
      }
    } catch (e) {
      console.warn("AI Evaluation endpoint failed, using default assessment", e);
    } finally {
      setLoadingAi(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const getWhatsAppMessage = () => {
    return `Halo Admin Politek IBC Jatibarang, saya telah menyelesaikan Placement Test Online (${subjectName}):
📋 *DATA PESERTA*:
- Nama Lengkap: ${result.studentName}
- No. WhatsApp: ${result.phone || '-'}
- Kategori Tes: ${subjectName}

📊 *HASIL SKOR PLACEMENT TEST*:
- Jumlah Soal Benar: ${correctCount} Soal
- Jumlah Soal Salah: ${wrongCount} Soal
- Nilai / Skor Akhir: ${percentage}% (Skor: ${correctCount}/${totalQuestions})
- Level Penempatan: ${result.recommendedLevel}
- Rekomendasi Program: ${result.recommendedCourse}

Mohon informasi pendaftaran kelas dan konfirmasi penempatan jadwal kursus saya di Politek IBC Jatibarang. Terima kasih!`;
  };

  const handleWhatsAppEnrollment = () => {
    const text = getWhatsAppMessage();
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${POLITEK_INFO.whatsappNumber}?text=${encoded}`, '_blank');
  };

  const handleCopySummary = () => {
    const text = getWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const categoryEntries: [string, { correct: number; total: number }][] = result.scores.categoryBreakdown && Object.keys(result.scores.categoryBreakdown).length > 0
    ? Object.entries(result.scores.categoryBreakdown)
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Top Banner Result Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl border border-indigo-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tes Placement Selesai & Terdata
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat, {result.studentName}!
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm max-w-lg">
              Berikut adalah laporan hasil perolehan skor & diagnostik resmi kemampuan {subjectName} Anda di Politek IBC.
            </p>
          </div>

          {/* Score Badge */}
          <div className="bg-white/10 backdrop-blur-md px-6 py-5 rounded-2xl border border-white/20 text-center flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">Nilai / Skor Akhir</span>
            <span className="text-4xl font-extrabold text-amber-400 my-1">{percentage}</span>
            <span className="text-xs text-slate-300 font-medium">Persentase: {percentage}% ({correctCount}/{totalQuestions})</span>
          </div>
        </div>
      </div>

      {/* PROMINENT DIRECTIVE: Kirim Hasil Tes ke WhatsApp 08211409313 */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-400/40 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              Langkah Wajib Selanjutnya
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Kirimkan Hasil Tes Anda ke WhatsApp: <span className="text-amber-300 underline decoration-amber-300/60 decoration-2">08211409313</span>
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Agar staf akademik Politek IBC dapat segera memvalidasi hasil tes, merekomendasikan jadwal kelas yang cocok, serta mengamankan slot pendaftaran Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={handleWhatsAppEnrollment}
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold rounded-2xl text-sm shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2.5 hover:scale-105 active:scale-95 cursor-pointer border border-emerald-200"
            >
              <MessageCircle className="w-5 h-5 fill-emerald-600 text-white" />
              <span>Kirim Hasil ke WA 08211409313</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopySummary}
              className="w-full sm:w-auto px-4 py-4 bg-emerald-800/60 hover:bg-emerald-800 text-white font-semibold rounded-2xl text-xs backdrop-blur-md transition-all flex items-center justify-center gap-2 border border-emerald-400/30 cursor-pointer"
              title="Salin Rangkuman Teks Hasil Tes"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-emerald-200" />
                  <span>Salin Teks Hasil</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Score Summary Cards: Correct, Wrong, Final Score */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Soal Benar */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Jumlah Soal Benar</span>
            <span className="text-2xl font-black text-emerald-600">{correctCount} <span className="text-xs font-semibold text-slate-400">Soal</span></span>
            <span className="text-[10px] text-emerald-700 block font-medium">Jawaban tepat</span>
          </div>
        </div>

        {/* Soal Salah */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Jumlah Soal Salah</span>
            <span className="text-2xl font-black text-rose-600">{wrongCount} <span className="text-xs font-semibold text-slate-400">Soal</span></span>
            <span className="text-[10px] text-rose-700 block font-medium">Jawaban kurang tepat</span>
          </div>
        </div>

        {/* Total Nilai */}
        <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-xs flex items-center gap-4 bg-gradient-to-br from-indigo-50/50 to-white">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Nilai / Skor</span>
            <span className="text-2xl font-black text-indigo-700">{percentage} <span className="text-xs font-semibold text-slate-400">/ 100</span></span>
            <span className="text-[10px] text-indigo-800 block font-medium">Akurasi {percentage}%</span>
          </div>
        </div>

      </div>

      {/* Recommended Level & Course Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recommended Level Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Tingkat Penempatan Anda:</span>
              <h3 className="text-xl font-bold text-slate-900">{result.recommendedLevel}</h3>
            </div>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            {result.subjectCategory === 'Komputer' 
              ? 'Tingkat ini menunjukkan tingkat kemahiran Anda dalam pengoperasian sistem komputer, aplikasi perkantoran Office, serta kemampuan efisiensi kerja digital.'
              : 'Tingkat ini menunjukkan Anda siap mengikuti materi komunikasi tingkat menengah hingga lanjutan dengan penekanan pada akurasi tata bahasa dan ekspresi profesional.'}
          </p>
        </div>

        {/* Recommended Course Card */}
        <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-xs flex flex-col justify-between space-y-4 bg-gradient-to-br from-indigo-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Rekomendasi Kursus Utama:</span>
              <h3 className="text-lg font-bold text-slate-900">{result.recommendedCourse}</h3>
            </div>
          </div>
          <button
            onClick={handleWhatsAppEnrollment}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Hasil ke Admin via WhatsApp</span>
          </button>
        </div>

      </div>

      {/* Score Breakdown Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600" />
          Rincian Jawaban Benar Per Kategori ({subjectName})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoryEntries.length > 0 ? (
            categoryEntries.map(([catName, stats]) => {
              const catPerc = Math.round((stats.correct / (stats.total || 1)) * 100);
              return (
                <div key={catName} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-slate-700 capitalize">{catName}</span>
                    <span className="text-indigo-600 font-bold">{stats.correct}/{stats.total} Benar</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${catPerc}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">Akurasi: {catPerc}%</span>
                </div>
              );
            })
          ) : (
            <>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className="text-slate-700">Grammar</span>
                  <span className="text-indigo-600">{result.scores.grammar}/{result.scores.maxGrammar} Benar</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(result.scores.grammar / (result.scores.maxGrammar || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className="text-slate-700">Vocabulary</span>
                  <span className="text-indigo-600">{result.scores.vocabulary}/{result.scores.maxVocabulary} Benar</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(result.scores.vocabulary / (result.scores.maxVocabulary || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className="text-slate-700">Reading</span>
                  <span className="text-indigo-600">{result.scores.reading}/{result.scores.maxReading} Benar</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(result.scores.reading / (result.scores.maxReading || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className="text-slate-700">Listening</span>
                  <span className="text-indigo-600">{result.scores.listening}/{result.scores.maxListening} Benar</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(result.scores.listening / (result.scores.maxListening || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI Diagnostic Report Box */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl border border-indigo-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-indigo-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Analisis Diagnostik AI Politek IBC</h3>
              <p className="text-xs text-indigo-300">Powered by Gemini AI Engine</p>
            </div>
          </div>
          {loadingAi && (
            <span className="text-xs text-amber-400 font-medium animate-pulse">Memproses analisis...</span>
          )}
        </div>

        {aiAnalysis && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-200">
            <p className="leading-relaxed bg-indigo-950/50 p-4 rounded-xl border border-indigo-800/80">
              {aiAnalysis.analysis}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Kekuatan Utama:</span>
                <ul className="space-y-1">
                  {aiAnalysis.strengths.map((str, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Fokus Peningkatan:</span>
                <ul className="space-y-1">
                  {aiAnalysis.weaknesses.map((wk, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Certificate Preview */}
      <div className="bg-amber-50/50 p-8 rounded-3xl border-2 border-dashed border-amber-300 relative text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white p-1.5 shadow-md border border-amber-200 flex items-center justify-center overflow-hidden">
          <img 
            src={politekLogo} 
            alt="Logo Politek IBC" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-800 tracking-widest uppercase">SERTIFIKAT HASIL PLACEMENT TEST</span>
          <h3 className="text-xl font-serif font-bold text-slate-900">{POLITEK_INFO.name}</h3>
          <p className="text-xs text-slate-500">Nomor Registrasi: {result.id}</p>
        </div>
        <p className="text-slate-700 text-xs italic max-w-md mx-auto">
          Dengan ini menerangkan bahwa <strong className="text-slate-900 font-semibold">{result.studentName}</strong> telah menyelesaikan Placement Test Online ({subjectName}) dengan perolehan <strong className="text-emerald-700 font-semibold">{correctCount} Soal Benar</strong> ({percentage}%) dan rekomendasi level <strong className="text-indigo-700 font-semibold">{result.recommendedLevel}</strong>.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={handleWhatsAppEnrollment}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Kirim Hasil via WA (08211409313)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cetak Sertifikat</span>
          </button>
          
          <button
            onClick={onRetake}
            className="px-4 py-2.5 bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Tes</span>
          </button>
        </div>
      </div>

    </div>
  );
};

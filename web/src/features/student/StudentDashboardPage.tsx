import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlacementTestResult } from '../../types';
import { DatabaseService } from '../../services/database.service';
import { POLITEK_INFO } from '../../lib/config';
import { 
  User, 
  BookOpen, 
  Award, 
  Sparkles, 
  FileText, 
  Calendar,
  ArrowRight
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<PlacementTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  const storedUser = DatabaseService.getStoredUser();
  const user = storedUser || { name: 'Siswa Politek IBC', email: 'siswa@politek-ibc.ac.id' };

  useEffect(() => {
    DatabaseService.getTestResults()
      .then((data) => {
        setTestResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Student dashboard fetch error:", err);
        setLoading(false);
      });
  }, []);

  const latestResult = testResults[0];

  return (
    <div className="py-10 bg-slate-50 min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-2xl">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Dashboard Siswa Politek IBC</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{user.name}</h1>
              <p className="text-xs text-slate-300">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/placement-test')}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Ikuti Placement Test</span>
            </button>
            
            <button
              onClick={() => navigate('/programs')}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Katalog Kursus</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Placement Test History & Active Status */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Latest Placement Test Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Hasil Placement Test Terakhir
                </h3>
                {latestResult && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {latestResult.recommendedLevel}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400">Memuat histori tes...</div>
              ) : latestResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Skor MCQ</p>
                      <p className="text-xl font-extrabold text-indigo-600">{latestResult.scores.total} / {latestResult.scores.maxTotal}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Grammar</p>
                      <p className="text-sm font-bold text-slate-800">{latestResult.scores.grammar} Benar</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Vocabulary</p>
                      <p className="text-sm font-bold text-slate-800">{latestResult.scores.vocabulary} Benar</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Reading</p>
                      <p className="text-sm font-bold text-slate-800">{latestResult.scores.reading} Benar</p>
                    </div>
                  </div>

                  <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-indigo-900 font-bold">Rekomendasi Kursus Untuk Anda:</p>
                      <p className="text-indigo-700 font-medium mt-0.5">{latestResult.recommendedCourse}</p>
                    </div>
                    <button
                      onClick={() => navigate('/programs')}
                      className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shrink-0"
                    >
                      Daftar Kelas
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
                  <p className="text-xs text-slate-500">Anda belum pernah mengambil placement test online.</p>
                  <button
                    onClick={() => navigate('/placement-test')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs shadow-xs"
                  >
                    Mulai Placement Test Gratis Sekarang
                  </button>
                </div>
              )}
            </div>

            {/* Test History List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Riwayat Pengerjaan Placement Test
              </h3>

              {testResults.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Belum ada riwayat tes terrekam di Supabase.</p>
              ) : (
                <div className="space-y-3">
                  {testResults.map((tr) => (
                    <div 
                      key={tr.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900">{tr.recommendedLevel}</span>
                        <p className="text-slate-500 text-[11px] flex items-center gap-2">
                          <span>{new Date(tr.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>Skor: {tr.scores.total}/{tr.scores.maxTotal}</span>
                        </p>
                      </div>

                      <span className="font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                        {tr.recommendedCourse}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Information & Student Schedule */}
          <div className="space-y-6">
            
            {/* Class Schedule Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Informasi Perkuliahan & Kontak
              </h3>
              
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800">Alamat Kampus Utama:</p>
                  <p className="text-slate-500 mt-0.5">{POLITEK_INFO.address}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800">Jam Operasional Layanan:</p>
                  <p className="text-slate-500 mt-0.5">{POLITEK_INFO.openingHours}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-800">WhatsApp Student Care:</p>
                  <a
                    href={`https://wa.me/${POLITEK_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline font-bold mt-0.5 block"
                  >
                    08211409313
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Benefits / Resources */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl border border-indigo-800 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Modul & Resource Belajar</span>
              </div>
              <h4 className="font-bold text-sm">Akses Materi & E-Book Gratis</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Setiap siswa Politek IBC berhak mendapatkan akses e-book gratis grammar practice & bank soal TOEFL/IELTS terbaru.
              </p>
              <button 
                onClick={() => navigate('/programs')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Lihat Katalog Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

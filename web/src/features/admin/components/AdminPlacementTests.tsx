import React, { useState } from 'react';
import { PlacementTestResult } from '../../../types';
import { Search, Eye, Filter, Sparkles, MessageSquare, Trash2 } from 'lucide-react';
import { POLITEK_INFO } from '../../../lib/config';

interface AdminPlacementTestsProps {
  testResults: PlacementTestResult[];
  onStatusChange: (id: string, status: PlacementTestResult['status']) => void;
  onSelectResult: (result: PlacementTestResult) => void;
  onDeleteResult?: (id: string, studentName: string) => void;
}

export const AdminPlacementTests: React.FC<AdminPlacementTestsProps> = ({ testResults, onStatusChange, onSelectResult, onDeleteResult }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [levelFilter, setLevelFilter] = useState<string>('Semua');

  const filteredResults = testResults.filter(item => {
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.phone.includes(searchTerm) || 
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.recommendedCourse.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter;
    
    let matchesLevel = true;
    if (levelFilter !== 'Semua') {
      matchesLevel = item.recommendedLevel.toLowerCase().includes(levelFilter.toLowerCase()) ||
                     (item.cefrLevel && item.cefrLevel === levelFilter);
    }

    return matchesSearch && matchesStatus && matchesLevel;
  });

  const handleWhatsAppContact = (item: PlacementTestResult) => {
    const totalQ = item.scores.maxTotal || 0;
    const correct = item.scores.total || 0;
    const wrong = Math.max(0, totalQ - correct);
    const scorePct = Math.round((correct / (totalQ || 1)) * 100);

    const text = `Halo Kak ${item.studentName}, kami dari Tim Admisi Politek IBC ingin menindaklanjuti hasil Placement Test Anda:
- Benar: ${correct} Soal
- Salah: ${wrong} Soal
- Nilai Akhir: ${scorePct}%
- Level: ${item.recommendedLevel}

Apakah Kak ${item.studentName} ada waktu untuk konsultasi pilihan jadwal kelas?`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nama, HP, email, atau program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Level:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none"
            >
              <option value="Semua">Semua Level</option>
              <option value="A1">A1 Beginner</option>
              <option value="A2">A2 Elementary</option>
              <option value="B1">B1 Intermediate</option>
              <option value="B2">B2 Upper-Intermediate</option>
              <option value="C1">C1 Advanced</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Baru">Baru</option>
              <option value="Dihubungi">Dihubungi</option>
              <option value="Terdaftar">Terdaftar</option>
              <option value="Batal">Batal</option>
            </select>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredResults.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">Tidak ada data placement test yang sesuai.</p>
            <p className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau filter status/level Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-900 text-white font-semibold">
                <tr>
                  <th className="p-4">Tanggal & Nama</th>
                  <th className="p-4">Kontak & Profil</th>
                  <th className="p-4">Skor & Level CEFR</th>
                  <th className="p-4">Program Rekomendasi</th>
                  <th className="p-4">Status Pendaftaran</th>
                  <th className="p-4 text-right">Aksi & Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResults.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="text-[10px] text-slate-400">{item.createdAt}</p>
                      <p className="font-bold text-slate-900 text-sm">{item.studentName}</p>
                    </td>
                    <td className="p-4 text-slate-600">
                      <p className="font-semibold text-slate-900">{item.phone}</p>
                      <p className="text-[11px] text-slate-400">{item.email}</p>
                      {item.education && (
                        <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded mt-1">
                          {item.education}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-extrabold text-indigo-700 text-sm">
                            Nilai: {Math.round((item.scores.total / (item.scores.maxTotal || 1)) * 100)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({item.scores.total}/{item.scores.maxTotal})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            ✓ {item.scores.total} Benar
                          </span>
                          <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            ✕ {Math.max(0, (item.scores.maxTotal || 0) - (item.scores.total || 0))} Salah
                          </span>
                        </div>
                        <span className="block text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded w-fit mt-1">
                          {item.recommendedLevel}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{item.recommendedCourse}</p>
                      {item.targetProgram && (
                        <p className="text-[10px] text-indigo-600 font-medium">Target: {item.targetProgram}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={item.status}
                        onChange={(e) => onStatusChange(item.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                          item.status === 'Baru' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          item.status === 'Terdaftar' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          item.status === 'Dihubungi' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="Baru">Baru</option>
                        <option value="Dihubungi">Dihubungi</option>
                        <option value="Terdaftar">Terdaftar</option>
                        <option value="Batal">Batal</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleWhatsAppContact(item)}
                          title="Hubungi via WhatsApp"
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WA</span>
                        </button>
                        <button
                          onClick={() => onSelectResult(item)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                        {onDeleteResult && (
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus hasil Placement Test milik "${item.studentName}"?`)) {
                                onDeleteResult(item.id, item.studentName);
                              }
                            }}
                            title="Hapus Hasil Tes"
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { PlacementQuestion, QuestionCategory, TestSubjectCategory } from '../../../types';
import { 
  createPlacementQuestion, 
  updatePlacementQuestion, 
  deletePlacementQuestion, 
  toggleQuestionActive, 
  seedDefaultQuestions 
} from '../../../services/placement.service';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Database,
  Filter,
  Check,
  X
} from 'lucide-react';

interface AdminQuestionBankProps {
  questions: PlacementQuestion[];
  onRefresh?: () => void;
}

export const AdminQuestionBank: React.FC<AdminQuestionBankProps> = ({ questions, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all'); // 'all' | 'B.inggris' | 'Komputer'
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PlacementQuestion | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [subjectCategory, setSubjectCategory] = useState<TestSubjectCategory>('B.inggris');
  const [category, setCategory] = useState<QuestionCategory>('grammar');
  const [questionText, setQuestionText] = useState('');
  const [passage, setPassage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setEditingQuestion(null);
    setSubjectCategory('B.inggris');
    setCategory('grammar');
    setQuestionText('');
    setPassage('');
    setAudioUrl('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer(0);
    setExplanation('');
    setIsActive(true);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q: PlacementQuestion) => {
    setEditingQuestion(q);
    setSubjectCategory(q.subjectCategory || 'B.inggris');
    setCategory(q.category);
    setQuestionText(q.questionText || '');
    setPassage(q.passage || '');
    setAudioUrl(q.audioUrl || '');
    setOptionA(q.options && q.options[0] ? q.options[0] : '');
    setOptionB(q.options && q.options[1] ? q.options[1] : '');
    setOptionC(q.options && q.options[2] ? q.options[2] : '');
    setOptionD(q.options && q.options[3] ? q.options[3] : '');
    setCorrectAnswer(q.correctAnswer ?? 0);
    setExplanation(q.explanation || '');
    setIsActive(q.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      alert('Teks soal wajib diisi.');
      return;
    }

    setLoadingAction(true);
    try {
      const isMcq = category !== 'essay';
      const optionsArray = isMcq ? [optionA, optionB, optionC, optionD].filter(o => o.trim() !== '') : undefined;

      const payload: Omit<PlacementQuestion, 'id'> = {
        category,
        subjectCategory,
        questionText: questionText.trim(),
        passage: passage.trim() || undefined,
        audioUrl: audioUrl.trim() || undefined,
        options: optionsArray && optionsArray.length > 0 ? optionsArray : undefined,
        correctAnswer: isMcq ? correctAnswer : undefined,
        explanation: explanation.trim() || undefined,
        isActive
      };

      if (editingQuestion) {
        await updatePlacementQuestion(editingQuestion.id, payload);
      } else {
        await createPlacementQuestion(payload);
      }

      setIsModalOpen(false);
      resetForm();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert('Gagal menyimpan soal: ' + (err?.message || err));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleToggleActive = async (q: PlacementQuestion) => {
    setLoadingAction(true);
    try {
      const nextState = !q.isActive;
      await toggleQuestionActive(q.id, nextState);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert('Gagal memperbarui status: ' + (err?.message || err));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingAction(true);
    try {
      await deletePlacementQuestion(id);
      setDeleteConfirmId(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert('Gagal menghapus soal: ' + (err?.message || err));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm('Apakah Anda yakin ingin mengisi 9 sample soal standar ke dalam tabel placement_questions di Supabase?')) {
      return;
    }
    setLoadingAction(true);
    try {
      await seedDefaultQuestions();
      if (onRefresh) onRefresh();
      alert('Berhasil menambahkan bank soal sample ke Supabase!');
    } catch (err: any) {
      alert('Gagal mengisi bank soal: ' + (err?.message || err));
    } finally {
      setLoadingAction(false);
    }
  };

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = 
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.explanation && q.explanation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.passage && q.passage.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || q.subjectCategory === selectedSubject;
    const matchesCategory = selectedCategory === 'all' || q.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'active' && q.isActive !== false) || 
      (selectedStatus === 'inactive' && q.isActive === false);

    return matchesSearch && matchesSubject && matchesCategory && matchesStatus;
  });

  const getSubjectBadgeClass = (subj?: TestSubjectCategory) => {
    if (subj === 'Komputer') {
      return 'bg-indigo-100 text-indigo-900 border-indigo-200';
    }
    return 'bg-blue-100 text-blue-900 border-blue-200';
  };

  const getCategoryBadgeClass = (cat: QuestionCategory) => {
    const c = String(cat).toLowerCase();
    if (c.includes('grammar')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (c.includes('vocab')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (c.includes('read')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (c.includes('listen')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (c.includes('essay')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (c.includes('computer') || c.includes('komputer')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    if (c.includes('office')) return 'bg-teal-50 text-teal-700 border-teal-200';
    if (c.includes('digital')) return 'bg-violet-50 text-violet-700 border-violet-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const inggrisCount = questions.filter(q => q.subjectCategory === 'B.inggris').length;
  const komputerCount = questions.filter(q => q.subjectCategory === 'Komputer').length;

  return (
    <div className="space-y-6">
      
      {/* Table Editor Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded border border-blue-200 uppercase tracking-wide">
                Table Editor • placement_questions
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                {questions.length} Total Soal
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-900" />
              <span>Kelola Bank Soal Placement Test</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Seluruh soal dibaca & disimpan secara langsung ke tabel <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">placement_questions</code> Supabase.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {questions.length === 0 && (
              <button
                onClick={handleSeed}
                disabled={loadingAction}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Isi Sample Bank Soal</span>
              </button>
            )}

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Soal Baru</span>
            </button>
          </div>
        </div>

        {/* Subject Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-500 mr-1">Kategori Subject:</span>
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({questions.length})
          </button>
          <button
            onClick={() => setSelectedSubject('B.inggris')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedSubject === 'B.inggris'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <span>🇬🇧 B.inggris</span>
            <span className="text-[10px] opacity-80">({inggrisCount})</span>
          </button>
          <button
            onClick={() => setSelectedSubject('Komputer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedSubject === 'Komputer'
                ? 'bg-indigo-900 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <span>💻 Komputer</span>
            <span className="text-[10px] opacity-80">({komputerCount})</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari teks soal, kosa kata, atau penjelasan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div className="sm:col-span-3 flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Sub-Kategori</option>
              <option value="grammar">Grammar</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="reading">Reading</option>
              <option value="listening">Listening</option>
              <option value="essay">Essay</option>
              <option value="Basic Computer">Basic Computer</option>
              <option value="Office Productivity">Office Productivity</option>
              <option value="Digital Productivity">Digital Productivity</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="active">Hanya Aktif (is_active = true)</option>
              <option value="inactive">Hanya Non-Aktif (is_active = false)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List / Table */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-sm">Belum ada soal Placement Test.</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {questions.length === 0 
                ? 'Tabel placement_questions di Supabase saat ini masih kosong. Silakan klik tombol "Tambah Soal Baru" atau "Isi Sample Bank Soal".'
                : 'Tidak ada soal yang cocok dengan filter pencarian Anda.'}
            </p>
          </div>
          {questions.length === 0 && (
            <button
              onClick={handleSeed}
              disabled={loadingAction}
              className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Isi Sample Bank Soal (9 Soal)</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4 w-36">Subject & Kategori</th>
                  <th className="py-3 px-4">Detail Teks Soal</th>
                  <th className="py-3 px-4 w-56">Pilihan Ospi & Kunci</th>
                  <th className="py-3 px-4 w-28 text-center">Status</th>
                  <th className="py-3 px-4 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredQuestions.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-semibold">
                      {idx + 1}
                    </td>

                    <td className="py-3.5 px-4 space-y-1">
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black border ${getSubjectBadgeClass(q.subjectCategory)}`}>
                          {q.subjectCategory === 'Komputer' ? '💻 Komputer' : '🇬🇧 B.inggris'}
                        </span>
                      </div>
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-bold ${getCategoryBadgeClass(q.category)}`}>
                          {q.category}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 space-y-1.5">
                      <p className="font-semibold text-slate-900 text-xs leading-snug">{q.questionText}</p>
                      
                      {q.passage && (
                        <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 italic">{q.passage}</span>
                        </div>
                      )}

                      {q.audioUrl && (
                        <div className="bg-blue-50/60 p-1.5 rounded-lg border border-blue-200/60 text-[11px] text-blue-900 flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-mono truncate max-w-xs">{q.audioUrl}</span>
                        </div>
                      )}

                      {q.explanation && (
                        <p className="text-[11px] text-slate-500 italic">
                          <span className="font-semibold text-slate-600">Penjelasan:</span> {q.explanation}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {q.options && q.options.length > 0 ? (
                        <div className="space-y-1">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = oIdx === q.correctAnswer;
                            return (
                              <div 
                                key={oIdx} 
                                className={`px-2 py-1 rounded text-[11px] flex items-center justify-between gap-1 ${
                                  isCorrect ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                {isCorrect && <Check className="w-3 h-3 text-emerald-700 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200 font-medium inline-block">
                          Soal Esai
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(q)}
                        disabled={loadingAction}
                        title="Klik untuk mengubah status is_active"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          q.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {q.isActive !== false ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Non-Aktif</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(q)}
                        disabled={loadingAction}
                        className="p-1.5 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Soal"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(q.id)}
                        disabled={loadingAction}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Soal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  SUPABASE DB
                </span>
                <h3 className="font-bold text-base mt-0.5">
                  {editingQuestion ? 'Edit Soal Placement Test' : 'Tambah Soal Baru ke Supabase'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Subject Utama</label>
                  <select
                    value={subjectCategory}
                    onChange={(e) => {
                      const subj = e.target.value as TestSubjectCategory;
                      setSubjectCategory(subj);
                      if (subj === 'Komputer' && (category === 'grammar' || category === 'vocabulary' || category === 'reading' || category === 'listening')) {
                        setCategory('Basic Computer');
                      } else if (subj === 'B.inggris' && (category === 'Basic Computer' || category === 'Office Productivity' || category === 'Digital Productivity')) {
                        setCategory('grammar');
                      }
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  >
                    <option value="B.inggris">🇬🇧 B.inggris</option>
                    <option value="Komputer">💻 Komputer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Sub-Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as QuestionCategory)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  >
                    {subjectCategory === 'B.inggris' ? (
                      <>
                        <option value="grammar">Grammar</option>
                        <option value="vocabulary">Vocabulary</option>
                        <option value="reading">Reading</option>
                        <option value="listening">Listening</option>
                        <option value="essay">Essay</option>
                      </>
                    ) : (
                      <>
                        <option value="Basic Computer">Basic Computer</option>
                        <option value="Office Productivity">Office Productivity</option>
                        <option value="Digital Productivity">Digital Productivity</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="flex items-end pb-0.5">
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 p-2.5 rounded-xl w-full">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800">Status Aktif (is_active)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Teks Soal *</label>
                <textarea
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Masukkan kalimat atau pertanyaan soal..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  required
                />
              </div>

              {category === 'reading' && (
                <div>
                  <label className="block font-bold text-amber-900 mb-1">Teks Bacaan (Passage)</label>
                  <textarea
                    rows={3}
                    value={passage}
                    onChange={(e) => setPassage(e.target.value)}
                    placeholder="Masukkan paragraf teks bacaan pendukung..."
                    className="w-full p-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
              )}

              {category === 'listening' && (
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Audio URL (opsional)</label>
                  <input
                    type="url"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="https://domain.com/audio.mp3"
                    className="w-full p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
              )}

              {category !== 'essay' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block font-bold text-slate-900 border-b border-slate-200 pb-1">
                    Pilihan Opsi Jawaban (Multiple Choice)
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Opsi A</label>
                      <input
                        type="text"
                        value={optionA}
                        onChange={(e) => setOptionA(e.target.value)}
                        placeholder="Pilihan A"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Opsi B</label>
                      <input
                        type="text"
                        value={optionB}
                        onChange={(e) => setOptionB(e.target.value)}
                        placeholder="Pilihan B"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Opsi C</label>
                      <input
                        type="text"
                        value={optionC}
                        onChange={(e) => setOptionC(e.target.value)}
                        placeholder="Pilihan C"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Opsi D</label>
                      <input
                        type="text"
                        value={optionD}
                        onChange={(e) => setOptionD(e.target.value)}
                        placeholder="Pilihan D"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">Kunci Jawaban Benar</label>
                    <select
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                      className="w-full p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-950 font-bold cursor-pointer"
                    >
                      <option value={0}>Opsi A ({optionA || 'Kosong'})</option>
                      <option value={1}>Opsi B ({optionB || 'Kosong'})</option>
                      <option value={2}>Opsi C ({optionC || 'Kosong'})</option>
                      <option value={3}>Opsi D ({optionD || 'Kosong'})</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">Penjelasan / Pembahasan (opsional)</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Penjelasan ringkas mengenai jawaban..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  {loadingAction ? 'Menyimpan...' : (editingQuestion ? 'Simpan Perubahan' : 'Tambah Soal')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-base">Hapus Soal?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Soal ini akan dihapus secara permanen dari tabel <code className="bg-slate-100 text-slate-800 px-1 rounded font-mono">placement_questions</code> di database Supabase.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={loadingAction}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md"
              >
                {loadingAction ? 'Menghapus...' : 'Ya, Hapus Soal'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

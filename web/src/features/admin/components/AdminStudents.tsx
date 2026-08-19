import React, { useState } from 'react';
import { StudentProfile, StudentProgram, StudentPackage, StudentStatus } from '../../../types';
import { DatabaseService } from '../../../services/database.service';
import * as XLSX from 'xlsx';
import { 
  Plus, 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Search, 
  Trash2, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  BookOpen, 
  X,
  Filter,
  Check,
  Edit3,
  Laptop,
  GraduationCap,
  Sparkles,
  School,
  ExternalLink
} from 'lucide-react';

interface AdminStudentsProps {
  students: StudentProfile[];
  onRefresh?: () => void;
}

interface ParsedStudentRow {
  fullName: string;
  whatsapp: string;
  education: string;
  school: string;
  program: StudentProgram;
  package: StudentPackage;
  registrationDate: string;
  startDate: string;
  status: StudentStatus;
  notes: string;
}

export const AdminStudents: React.FC<AdminStudentsProps> = ({ students, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState<'ALL' | StudentProgram>('ALL');
  const [packageFilter, setPackageFilter] = useState<'ALL' | StudentPackage>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | StudentStatus>('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [whatsappModalStudent, setWhatsappModalStudent] = useState<StudentProfile | null>(null);
  const [customWaMessage, setCustomWaMessage] = useState('');

  // Form State
  const [formState, setFormState] = useState<{
    fullName: string;
    whatsapp: string;
    birthDate: string;
    education: string;
    school: string;
    program: StudentProgram;
    package: StudentPackage;
    registrationDate: string;
    startDate: string;
    status: StudentStatus;
    notes: string;
  }>({
    fullName: '',
    whatsapp: '',
    birthDate: '',
    education: 'SMA',
    school: '',
    program: 'english',
    package: 'regular',
    registrationDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    status: 'active',
    notes: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  // Excel Upload state
  const [excelPreview, setExcelPreview] = useState<ParsedStudentRow[]>([]);
  const [excelError, setExcelError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  // Filter logic
  const filteredStudents = students.filter(s => {
    const fullName = (s.fullName || s.name || '').toLowerCase();
    const wa = (s.whatsapp || s.phone || '').toLowerCase();
    const school = (s.school || '').toLowerCase();
    const notes = (s.notes || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = fullName.includes(query) || wa.includes(query) || school.includes(query) || notes.includes(query);
    const matchesProgram = programFilter === 'ALL' || s.program === programFilter;
    const matchesPackage = packageFilter === 'ALL' || s.package === packageFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;

    return matchesSearch && matchesProgram && matchesPackage && matchesStatus;
  });

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormState({
      fullName: '',
      whatsapp: '',
      birthDate: '',
      education: 'SMA',
      school: '',
      program: 'english',
      package: 'regular',
      registrationDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      notes: ''
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (student: StudentProfile) => {
    setEditingStudent(student);
    setFormState({
      fullName: student.fullName || student.name || '',
      whatsapp: student.whatsapp || student.phone || '',
      birthDate: student.birthDate || '',
      education: student.education || 'SMA',
      school: student.school || '',
      program: student.program || 'english',
      package: student.package || 'regular',
      registrationDate: student.registrationDate || student.joinDate || new Date().toISOString().split('T')[0],
      startDate: student.startDate || student.registrationDate || new Date().toISOString().split('T')[0],
      status: student.status || 'active',
      notes: student.notes || ''
    });
    setShowAddModal(true);
  };

  // Save Student
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.fullName.trim() || !formState.whatsapp.trim()) {
      alert("Nama Lengkap dan Nomor WhatsApp wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      await DatabaseService.saveStudent({
        id: editingStudent ? editingStudent.id : undefined,
        fullName: formState.fullName.trim(),
        whatsapp: formState.whatsapp.trim(),
        birthDate: formState.birthDate,
        education: formState.education,
        school: formState.school.trim(),
        program: formState.program,
        package: formState.package,
        registrationDate: formState.registrationDate,
        startDate: formState.startDate,
        status: formState.status,
        notes: formState.notes.trim()
      });

      setShowAddModal(false);
      if (onRefresh) onRefresh();
      setImportSuccessMessage(editingStudent ? "Data siswa berhasil diperbarui!" : "Siswa baru berhasil ditambahkan ke database!");
      setTimeout(() => setImportSuccessMessage(null), 4000);
    } catch (err: any) {
      alert("Gagal menyimpan data siswa: " + err?.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Student
  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data siswa "${name}" dari database?`)) return;

    try {
      await DatabaseService.deleteStudent(id);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert("Gagal menghapus siswa: " + err?.message);
    }
  };

  // Download Excel Template
  const downloadExcelTemplate = () => {
    const templateData = [
      {
        "Nama Lengkap": "Ahmad Fauzi",
        "Nomor WhatsApp": "08211409313",
        "Pendidikan": "SMA",
        "Sekolah Instansi": "SMA 1 Jatibarang",
        "Program (english/computer)": "english",
        "Paket (basic/regular/intensive)": "regular",
        "Tanggal Daftar": "2026-08-01",
        "Tanggal Mulai": "2026-08-05",
        "Status (active/graduated/inactive/trial)": "active",
        "Catatan": "Kelas sore jam 15.30"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    worksheet['!cols'] = [
      { wch: 25 }, { wch: 18 }, { wch: 15 }, { wch: 25 },
      { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 16 },
      { wch: 15 }, { wch: 30 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Siswa");
    XLSX.writeFile(workbook, "Template_Data_Siswa_Politek_IBC.xlsx");
  };

  // Export Current Students to Excel
  const exportStudentsToExcel = () => {
    if (filteredStudents.length === 0) {
      alert("Tidak ada data siswa untuk diexport.");
      return;
    }

    const dataToExport = filteredStudents.map((s, idx) => ({
      "No": idx + 1,
      "ID Siswa": s.studentId || s.id,
      "Nama Lengkap": s.fullName || s.name,
      "Nomor WhatsApp": s.whatsapp || s.phone,
      "Tanggal Lahir": s.birthDate || '-',
      "Pendidikan": s.education || '-',
      "Sekolah / Instansi": s.school || '-',
      "Program": s.program === 'computer' ? 'Komputer' : 'Bahasa Inggris',
      "Paket": s.package ? s.package.toUpperCase() : 'REGULAR',
      "Tanggal Daftar": s.registrationDate || s.joinDate,
      "Tanggal Mulai": s.startDate || '-',
      "Status": (s.status || 'active').toUpperCase(),
      "Catatan": s.notes || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    worksheet['!cols'] = [
      { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 18 },
      { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 18 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 30 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa IBC");
    XLSX.writeFile(workbook, `Data_Siswa_Politek_IBC_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Handle Excel Upload Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelError(null);
    setExcelPreview([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        const data = new Uint8Array(buffer);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames.length) {
          throw new Error("File Excel kosong.");
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

        if (!rawData || rawData.length === 0) {
          setExcelError("File Excel kosong. Silakan gunakan template resmi.");
          return;
        }

        const parsed: ParsedStudentRow[] = rawData.map((row) => {
          let fullName = '';
          let whatsapp = '';
          let education = 'SMA';
          let school = '';
          let program: StudentProgram = 'english';
          let pkg: StudentPackage = 'regular';
          let regDate = new Date().toISOString().split('T')[0];
          let startDate = new Date().toISOString().split('T')[0];
          let status: StudentStatus = 'active';
          let notes = '';

          Object.keys(row).forEach((key) => {
            const normKey = key.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
            const val = String(row[key] || '').trim();

            if (normKey.includes('nama') || normKey.includes('fullname')) fullName = val;
            else if (normKey.includes('wa') || normKey.includes('phone') || normKey.includes('whatsapp')) whatsapp = val;
            else if (normKey.includes('pendidikan') || normKey.includes('education')) education = val || 'SMA';
            else if (normKey.includes('sekolah') || normKey.includes('instansi')) school = val;
            else if (normKey.includes('program')) {
              program = val.toLowerCase().includes('komputer') || val.toLowerCase() === 'computer' ? 'computer' : 'english';
            } else if (normKey.includes('paket')) {
              const lowerPkg = val.toLowerCase();
              if (lowerPkg.includes('basic')) pkg = 'basic';
              else if (lowerPkg.includes('intensive') || lowerPkg.includes('intensif')) pkg = 'intensive';
              else pkg = 'regular';
            } else if (normKey.includes('daftar') || normKey.includes('registration')) {
              if (val) regDate = val;
            } else if (normKey.includes('mulai') || normKey.includes('start')) {
              if (val) startDate = val;
            } else if (normKey.includes('status')) {
              const lowerSt = val.toLowerCase();
              if (['active', 'graduated', 'inactive', 'trial'].includes(lowerSt)) {
                status = lowerSt as StudentStatus;
              }
            } else if (normKey.includes('catatan') || normKey.includes('notes')) {
              notes = val;
            }
          });

          return { fullName, whatsapp, education, school, program, package: pkg, registrationDate: regDate, startDate, status, notes };
        }).filter(r => r.fullName && r.whatsapp);

        setExcelPreview(parsed);
      } catch (err: any) {
        setExcelError("Gagal membaca file Excel: " + err?.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Import Excel batch
  const handleImportExcel = async () => {
    if (excelPreview.length === 0) return;

    setIsImporting(true);
    try {
      await DatabaseService.saveStudentsBatch(excelPreview);
      setShowExcelModal(false);
      setExcelPreview([]);
      if (onRefresh) onRefresh();
      setImportSuccessMessage(`Berhasil mengimpor ${excelPreview.length} siswa ke database Supabase!`);
      setTimeout(() => setImportSuccessMessage(null), 4000);
    } catch (err: any) {
      alert("Gagal mengimpor data: " + err?.message);
    } finally {
      setIsImporting(false);
    }
  };

  // Send One-Click WhatsApp
  const handleOpenWhatsapp = (student: StudentProfile) => {
    setWhatsappModalStudent(student);
    const waName = student.fullName || student.name;
    const defaultMsg = `Halo Kak ${waName}, salam hangat dari POLITEK IBC Jatibarang! 🙏\n\nKami menginformasikan terkait jadwal kelas program ${student.program === 'computer' ? 'Komputer' : 'Bahasa Inggris'} (Paket ${student.package?.toUpperCase() || 'REGULAR'}).\n\nAda yang ingin ditanyakan seputar materi atau pembayaran? Terima kasih.`;
    setCustomWaMessage(defaultMsg);
  };

  const executeSendWa = (messageText: string) => {
    if (!whatsappModalStudent) return;
    const rawWa = whatsappModalStudent.whatsapp || whatsappModalStudent.phone || '';
    const cleanWa = rawWa.replace(/[^0-9]/g, '');
    const targetWa = cleanWa.startsWith('0') ? '62' + cleanWa.substring(1) : cleanWa;
    
    window.open(`https://wa.me/${targetWa}?text=${encodeURIComponent(messageText)}`, '_blank');
    setWhatsappModalStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {importSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{importSuccessMessage}</span>
          </div>
          <button onClick={() => setImportSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {/* Action Header & Search Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Database Siswa POLITEK IBC</h3>
            <p className="text-xs text-slate-500">Kelola pendaftaran, filter program, paket & status siswa secara langsung di Supabase.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Siswa Manual</span>
            </button>

            <button
              onClick={() => setShowExcelModal(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={exportStudentsToExcel}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama, WA, sekolah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Filter Program */}
          <div className="relative">
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Program Kursus</option>
              <option value="english">🇬🇧 Bahasa Inggris</option>
              <option value="computer">👨‍💻 Komputer & IT</option>
            </select>
          </div>

          {/* Filter Paket */}
          <div className="relative">
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Paket Kursus</option>
              <option value="basic">Paket Basic (Rp 250k)</option>
              <option value="regular">Paket Regular (Rp 450k)</option>
              <option value="intensive">Paket Intensive (Rp 650k)</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Status Siswa</option>
              <option value="active">📚 Aktif Belajar</option>
              <option value="graduated">🎓 Lulus / Alumni</option>
              <option value="inactive">❌ Nonaktif / Cuti</option>
              <option value="trial">🧪 Trial / Uji Coba</option>
            </select>
          </div>

        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700">
            Menampilkan {filteredStudents.length} dari {students.length} Siswa
          </span>
          {(searchTerm || programFilter !== 'ALL' || packageFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setProgramFilter('ALL');
                setPackageFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <Search className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">Tidak ada siswa yang sesuai kriteria pencarian / filter.</p>
            <p className="text-slate-400">Coba ubah kata kunci atau kata filter di atas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Siswa</th>
                  <th className="py-3.5 px-4">Program & Paket</th>
                  <th className="py-3.5 px-4">Pendidikan / Sekolah</th>
                  <th className="py-3.5 px-4">Tgl Daftar & Mulai</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Catatan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const fullName = student.fullName || student.name || 'Siswa';
                  const wa = student.whatsapp || student.phone || '';
                  
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shrink-0 ${
                            student.program === 'computer' ? 'bg-blue-600' : 'bg-red-600'
                          }`}>
                            {fullName.substring(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900">{fullName}</span>
                            <span className="text-[10px] font-mono text-slate-400 block">{student.studentId || student.id}</span>
                            <span className="text-[11px] text-emerald-700 font-medium">{wa}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            student.program === 'computer' 
                              ? 'bg-blue-50 text-blue-800 border-blue-200' 
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}>
                            {student.program === 'computer' ? <Laptop className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                            {student.program === 'computer' ? 'Komputer & IT' : 'Bahasa Inggris'}
                          </span>
                          <span className="block text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                            Paket {student.package || 'REGULAR'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-semibold text-slate-800 block">{student.education || '-'}</span>
                          <span className="text-[11px] text-slate-500 block">{student.school || '-'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-[11px]">
                          <span className="text-slate-500 block">Reg: {student.registrationDate || student.joinDate}</span>
                          <span className="text-slate-700 font-semibold block">Mulai: {student.startDate || '-'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          student.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          student.status === 'graduated' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          student.status === 'trial' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {student.status || 'active'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-500 text-[11px] max-w-[180px] truncate block">
                          {student.notes || '-'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenWhatsapp(student)}
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                            title="Kirim Pesan WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(student)}
                            className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                            title="Edit Data Siswa"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id, fullName)}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  {editingStudent ? 'Edit Profil Siswa' : 'Pendaftaran Siswa Baru'}
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {editingStudent ? 'Perbarui Data Siswa' : 'Tambah Siswa ke Supabase'}
                </h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Fauzi"
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nomor WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 08211409313"
                    value={formState.whatsapp}
                    onChange={(e) => setFormState({ ...formState, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Pendidikan Terakhir</label>
                  <select
                    value={formState.education}
                    onChange={(e) => setFormState({ ...formState, education: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="SD">SD / Sederajat</option>
                    <option value="SMP">SMP / Sederajat</option>
                    <option value="SMA">SMA / SMK / MA</option>
                    <option value="Kuliah">Mahasiswa / Mahasiswi</option>
                    <option value="Umum">Umum / Pekerja</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Sekolah / Instansi (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: SMA Negeri 1 Jatibarang"
                    value={formState.school}
                    onChange={(e) => setFormState({ ...formState, school: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Program Kursus</label>
                  <select
                    value={formState.program}
                    onChange={(e) => setFormState({ ...formState, program: e.target.value as StudentProgram })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="english">🇬🇧 Bahasa Inggris</option>
                    <option value="computer">👨‍💻 Komputer & IT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Paket Kursus</label>
                  <select
                    value={formState.package}
                    onChange={(e) => setFormState({ ...formState, package: e.target.value as StudentPackage })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="basic">Paket Basic (Rp 250.000 / bln)</option>
                    <option value="regular">Paket Regular (Rp 450.000 / bln)</option>
                    <option value="intensive">Paket Intensive (Rp 650.000 / bln)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tanggal Daftar</label>
                  <input
                    type="date"
                    value={formState.registrationDate}
                    onChange={(e) => setFormState({ ...formState, registrationDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tanggal Mulai Belajar</label>
                  <input
                    type="date"
                    value={formState.startDate}
                    onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status Belajar Siswa</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as StudentStatus })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">📚 Aktif Belajar</option>
                    <option value="graduated">🎓 Lulus / Alumni</option>
                    <option value="inactive">❌ Nonaktif / Cuti</option>
                    <option value="trial">🧪 Trial / Uji Coba</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tanggal Lahir (Opsional)</label>
                  <input
                    type="date"
                    value={formState.birthDate}
                    onChange={(e) => setFormState({ ...formState, birthDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan Khusus (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Catatan jam kelas, preferensi instruktur, dsb..."
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : editingStudent ? 'Simpan Perubahan' : 'Tambah Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Import Excel */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Impor Massal Excel</span>
                <h3 className="text-lg font-black text-slate-900">Upload Data Siswa (.xlsx)</h3>
              </div>
              <button onClick={() => setShowExcelModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold block">1. Unduh Template Excel Resmi</span>
                  <span className="text-[11px] text-emerald-700">Format kolom sudah disesuaikan dengan database Supabase.</span>
                </div>
                <button
                  onClick={downloadExcelTemplate}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-800 transition-colors cursor-pointer shrink-0"
                >
                  Download Template
                </button>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <span className="font-bold text-slate-700 block">2. Pilih / Drag File Excel di Sini</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              {excelError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-medium">
                  {excelError}
                </div>
              )}

              {excelPreview.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-800">Pratinjau Impor ({excelPreview.length} Siswa Terbaca):</span>
                  <div className="max-h-40 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    {excelPreview.slice(0, 5).map((row, i) => (
                      <div key={i} className="flex justify-between text-[11px] text-slate-700 border-b border-slate-200/60 pb-1">
                        <span className="font-semibold">{row.fullName} ({row.whatsapp})</span>
                        <span className="text-indigo-600 font-bold uppercase">{row.program} - {row.package}</span>
                      </div>
                    ))}
                    {excelPreview.length > 5 && (
                      <span className="text-[10px] text-slate-400 block italic pt-1">...dan {excelPreview.length - 5} siswa lainnya.</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowExcelModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleImportExcel}
                disabled={excelPreview.length === 0 || isImporting}
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isImporting ? 'Mengimpor...' : `Impor ${excelPreview.length} Siswa ke Database`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kirim WhatsApp */}
      {whatsappModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-5 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">WhatsApp Sekali Klik</span>
                <h3 className="text-lg font-black text-slate-900">{whatsappModalStudent.fullName || whatsappModalStudent.name}</h3>
              </div>
              <button onClick={() => setWhatsappModalStudent(null)} className="text-slate-400 font-bold hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Template Pesan:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      const waName = whatsappModalStudent.fullName || whatsappModalStudent.name;
                      setCustomWaMessage(`Halo Kak ${waName}, salam hangat dari POLITEK IBC Jatibarang! 🙏\n\nKami menginformasikan terkait jadwal kelas program ${whatsappModalStudent.program === 'computer' ? 'Komputer' : 'Bahasa Inggris'} (Paket ${whatsappModalStudent.package?.toUpperCase() || 'REGULAR'}).\n\nAda yang ingin ditanyakan seputar materi atau pembayaran? Terima kasih.`);
                    }}
                    className="p-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 text-left cursor-pointer"
                  >
                    👋 Ucapan Info Kelas
                  </button>
                  <button
                    onClick={() => {
                      const waName = whatsappModalStudent.fullName || whatsappModalStudent.name;
                      setCustomWaMessage(`Halo Kak ${waName}, ini pengingat pembayaran administrasi kursus POLITEK IBC bulan ini. Mohon info jika pembayaran sudah dilakukan via Transfer/QRIS/Tunai. Terima kasih!`);
                    }}
                    className="p-2 bg-slate-50 hover:bg-amber-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 text-left cursor-pointer"
                  >
                    💰 Tagihan Kursus
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Isi Pesan WhatsApp:</label>
                <textarea
                  rows={5}
                  value={customWaMessage}
                  onChange={(e) => setCustomWaMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setWhatsappModalStudent(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => executeSendWa(customWaMessage)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Buka Aplikasi WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

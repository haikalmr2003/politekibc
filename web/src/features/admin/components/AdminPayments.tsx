import React, { useState, useEffect } from 'react';
import { PaymentRecord, StudentProfile, PaymentStatus, PaymentMethod } from '../../../types';
import { DatabaseService } from '../../../services/database.service';
import * as XLSX from 'xlsx';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MessageCircle, 
  Download, 
  Trash2, 
  Edit3, 
  Calendar, 
  Filter, 
  CreditCard,
  QrCode,
  Building,
  UserCheck
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PaymentStatus | 'OVERDUE'>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>('ALL');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [whatsappModalPayment, setWhatsappModalPayment] = useState<PaymentRecord | null>(null);
  const [customWaMessage, setCustomWaMessage] = useState('');

  // Form State
  const [formState, setFormState] = useState<{
    studentId: string;
    billingMonth: string;
    amount: number;
    dueDate: string;
    paidDate: string;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    notes: string;
  }>({
    studentId: '',
    billingMonth: new Date().toISOString().substring(0, 7),
    amount: 450000,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    paidDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'paid',
    paymentMethod: 'Transfer',
    notes: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, sData] = await Promise.all([
        DatabaseService.getPayments(),
        DatabaseService.getStudents()
      ]);
      setPayments(pData);
      setStudents(sData);

      if (sData.length > 0 && !formState.studentId) {
        setFormState(prev => ({ ...prev, studentId: sData[0].id }));
      }
    } catch (err: any) {
      console.error("Gagal memuat data pembayaran:", err);
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering payments
  const filteredPayments = payments.filter(p => {
    const student = students.find(s => s.id === p.studentId);
    const sName = (student?.fullName || student?.name || p.studentName || '').toLowerCase();
    const sWa = (student?.whatsapp || student?.phone || p.studentWhatsapp || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = sName.includes(query) || sWa.includes(query) || (p.notes || '').toLowerCase().includes(query);
    
    let matchesStatus = true;
    if (statusFilter === 'OVERDUE') {
      matchesStatus = p.paymentStatus !== 'paid' && p.dueDate < todayStr;
    } else if (statusFilter !== 'ALL') {
      matchesStatus = p.paymentStatus === statusFilter;
    }

    const matchesMonth = monthFilter === 'ALL' || p.billingMonth === monthFilter;

    return matchesSearch && matchesStatus && matchesMonth;
  });

  // Calculate stats
  const totalPaid = payments.filter(p => p.paymentStatus === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalUnpaid = payments.filter(p => p.paymentStatus !== 'paid').reduce((sum, p) => sum + p.amount, 0);
  const overdueCount = payments.filter(p => p.paymentStatus !== 'paid' && p.dueDate < todayStr).length;

  const formatRp = (num: number) => 'Rp ' + num.toLocaleString('id-ID');

  // Open Modal
  const handleOpenAddModal = () => {
    setEditingPayment(null);
    setFormState({
      studentId: students.length > 0 ? students[0].id : '',
      billingMonth: new Date().toISOString().substring(0, 7),
      amount: 450000,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      paidDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'paid',
      paymentMethod: 'Transfer',
      notes: ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (p: PaymentRecord) => {
    setEditingPayment(p);
    setFormState({
      studentId: p.studentId,
      billingMonth: p.billingMonth,
      amount: p.amount,
      dueDate: p.dueDate,
      paidDate: p.paidDate || new Date().toISOString().split('T')[0],
      paymentStatus: p.paymentStatus,
      paymentMethod: p.paymentMethod || 'Transfer',
      notes: p.notes || ''
    });
    setShowModal(true);
  };

  // Save payment
  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.studentId) {
      alert("Silakan pilih siswa terlebih dahulu.");
      return;
    }

    setIsSaving(true);
    try {
      const selectedStudent = students.find(s => s.id === formState.studentId);
      await DatabaseService.savePayment({
        id: editingPayment ? editingPayment.id : undefined,
        studentId: formState.studentId,
        studentName: selectedStudent?.fullName || selectedStudent?.name,
        studentWhatsapp: selectedStudent?.whatsapp || selectedStudent?.phone,
        billingMonth: formState.billingMonth,
        amount: Number(formState.amount),
        dueDate: formState.dueDate,
        paidDate: formState.paymentStatus === 'paid' ? formState.paidDate : undefined,
        paymentStatus: formState.paymentStatus,
        paymentMethod: formState.paymentMethod,
        notes: formState.notes
      });

      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert("Gagal menyimpan data pembayaran: " + err?.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete payment
  const handleDeletePayment = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data riwayat pembayaran ini?")) return;

    try {
      await DatabaseService.deletePayment(id);
      loadData();
    } catch (err: any) {
      alert("Gagal menghapus pembayaran: " + err?.message);
    }
  };

  // Export to Excel
  const exportPaymentsToExcel = () => {
    if (filteredPayments.length === 0) {
      alert("Tidak ada data pembayaran untuk diexport.");
      return;
    }

    const exportData = filteredPayments.map((p, idx) => {
      const student = students.find(s => s.id === p.studentId);
      return {
        "No": idx + 1,
        "ID Transaksi": p.id,
        "Nama Siswa": student?.fullName || student?.name || p.studentName || 'Siswa',
        "WhatsApp": student?.whatsapp || student?.phone || p.studentWhatsapp || '-',
        "Bulan Tagihan": p.billingMonth,
        "Jumlah SPP": p.amount,
        "Jatuh Tempo": p.dueDate,
        "Tanggal Bayar": p.paidDate || '-',
        "Status Pembayaran": p.paymentStatus.toUpperCase(),
        "Metode Pembayaran": p.paymentMethod || 'Cash',
        "Catatan": p.notes || '-'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [
      { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 18 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 18 }, { wch: 18 }, { wch: 25 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Pembayaran");
    XLSX.writeFile(workbook, `Laporan_Pembayaran_Politek_IBC_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Open WhatsApp Notice
  const handleOpenWhatsappNotice = (p: PaymentRecord) => {
    setWhatsappModalPayment(p);
    const student = students.find(s => s.id === p.studentId);
    const sName = student?.fullName || student?.name || p.studentName || 'Siswa';
    const isPaid = p.paymentStatus === 'paid';

    let msg = '';
    if (isPaid) {
      msg = `Halo Kak ${sName}, terima kasih! Kuitansi pembayaran SPP Politek IBC bulan ${p.billingMonth} sebesar ${formatRp(p.amount)} telah KAMI TERIMA dengan status LUNAS via ${p.paymentMethod || 'Transfer'}. 🙏✨`;
    } else {
      msg = `Halo Kak ${sName}, salam dari Politek IBC Jatibarang! 🙏\n\nKami mengingatkan tagihan kursus bulan ${p.billingMonth} sebesar ${formatRp(p.amount)} dengan tanggal jatuh tempo ${p.dueDate}.\n\nPembayaran dapat dilakukan secara Tunai di Kampus IBC atau Transfer via Bank/QRIS. Mohon konfirmasi jika sudah bayar. Terima kasih.`;
    }

    setCustomWaMessage(msg);
  };

  const executeSendWa = (messageText: string) => {
    if (!whatsappModalPayment) return;
    const student = students.find(s => s.id === whatsappModalPayment.studentId);
    const rawWa = student?.whatsapp || student?.phone || whatsappModalPayment.studentWhatsapp || '08211409313';
    const cleanWa = rawWa.replace(/[^0-9]/g, '');
    const targetWa = cleanWa.startsWith('0') ? '62' + cleanWa.substring(1) : cleanWa;

    window.open(`https://wa.me/${targetWa}?text=${encodeURIComponent(messageText)}`, '_blank');
    setWhatsappModalPayment(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Lunas</span>
          <p className="text-2xl font-black text-emerald-700">{formatRp(totalPaid)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            {payments.filter(p => p.paymentStatus === 'paid').length} Transaksi Terbayar
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tunggakan SPP</span>
          <p className="text-2xl font-black text-amber-600">{formatRp(totalUnpaid)}</p>
          <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full inline-block">
            {payments.filter(p => p.paymentStatus !== 'paid').length} Tagihan Belum Lunas
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa Telat Bayar</span>
          <p className="text-2xl font-black text-rose-600">{overdueCount} Siswa</p>
          <button
            onClick={() => setStatusFilter('OVERDUE')}
            className="text-[11px] text-rose-700 font-bold hover:underline block cursor-pointer"
          >
            ⏰ Klik untuk filter siswa telat →
          </button>
        </div>
      </div>

      {/* Main Header & Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Pencatatan SPP & Pembayaran Siswa</h3>
            <p className="text-xs text-slate-500">Satu siswa dapat memiliki riwayat pembayaran berkali-kali secara fleksibel.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Transaksi Baru</span>
            </button>

            <button
              onClick={exportPaymentsToExcel}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama siswa atau catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Status Pembayaran</option>
              <option value="paid">✅ Lunas (Paid)</option>
              <option value="unpaid">⏳ Belum Bayar (Unpaid)</option>
              <option value="partial">💳 Bayar Sebagian (Partial)</option>
              <option value="OVERDUE">⏰ Telat Lewat Jatuh Tempo</option>
            </select>
          </div>

          <div>
            <input
              type="month"
              value={monthFilter === 'ALL' ? '' : monthFilter}
              onChange={(e) => setMonthFilter(e.target.value ? e.target.value : 'ALL')}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Memuat data pembayaran dari Supabase...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <DollarSign className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">Tidak ada transaksi pembayaran yang cocok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">Bulan Tagihan</th>
                  <th className="py-3.5 px-4">Jumlah SPP</th>
                  <th className="py-3.5 px-4">Jatuh Tempo</th>
                  <th className="py-3.5 px-4">Status & Metode</th>
                  <th className="py-3.5 px-4">Catatan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => {
                  const student = students.find(s => s.id === p.studentId);
                  const sName = student?.fullName || student?.name || p.studentName || 'Siswa';
                  const isOverdue = p.paymentStatus !== 'paid' && p.dueDate < todayStr;

                  return (
                    <tr key={p.id} className={`hover:bg-slate-50/80 transition-colors ${isOverdue ? 'bg-rose-50/30' : ''}`}>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>
                          <span className="block font-bold text-slate-900">{sName}</span>
                          <span className="text-[10px] text-emerald-700 font-mono block">
                            {student?.whatsapp || student?.phone || p.studentWhatsapp || '-'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {p.billingMonth}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-black text-slate-900 text-sm">
                          {formatRp(p.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className={`block font-semibold ${isOverdue ? 'text-rose-700 font-black' : 'text-slate-700'}`}>
                            {p.dueDate}
                          </span>
                          {isOverdue && (
                            <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded inline-block">
                              ⏰ Telat Lewat Tempo
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                            p.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            p.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {p.paymentStatus === 'paid' ? '✅ Lunas' : p.paymentStatus === 'partial' ? '💳 Partial' : '⏳ Belum Bayar'}
                          </span>
                          <span className="text-[10px] text-slate-500 block font-medium">
                            Metode: {p.paymentMethod || 'Cash'} {p.paidDate ? `(${p.paidDate})` : ''}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-500 text-[11px] max-w-[150px] truncate block">
                          {p.notes || '-'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenWhatsappNotice(p)}
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                            title="Ingatkan / Kirim Kuitansi WA"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                            title="Edit Transaksi"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePayment(p.id)}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Transaksi"
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

      {/* Modal Add / Edit Payment */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  {editingPayment ? 'Edit Pembayaran' : 'Catat Tagihan / Pembayaran SPP'}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {editingPayment ? 'Perbarui Data Pembayaran' : 'Tambah Pembayaran Baru'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Pilih Siswa *</label>
                <select
                  required
                  value={formState.studentId}
                  onChange={(e) => setFormState({ ...formState, studentId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName || s.name} ({s.whatsapp || s.phone}) - Paket {s.package?.toUpperCase() || 'REGULAR'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bulan Tagihan (YYYY-MM)</label>
                  <input
                    type="month"
                    required
                    value={formState.billingMonth}
                    onChange={(e) => setFormState({ ...formState, billingMonth: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Jumlah Tagihan (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formState.amount}
                    onChange={(e) => setFormState({ ...formState, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tanggal Jatuh Tempo</label>
                  <input
                    type="date"
                    required
                    value={formState.dueDate}
                    onChange={(e) => setFormState({ ...formState, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status Pembayaran</label>
                  <select
                    value={formState.paymentStatus}
                    onChange={(e) => setFormState({ ...formState, paymentStatus: e.target.value as PaymentStatus })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="paid">✅ Lunas (Paid)</option>
                    <option value="unpaid">⏳ Belum Bayar (Unpaid)</option>
                    <option value="partial">💳 Cicilan / Partial</option>
                  </select>
                </div>
              </div>

              {formState.paymentStatus === 'paid' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Tanggal Pelunasan</label>
                    <input
                      type="date"
                      value={formState.paidDate}
                      onChange={(e) => setFormState({ ...formState, paidDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Metode Bayar</label>
                    <select
                      value={formState.paymentMethod}
                      onChange={(e) => setFormState({ ...formState, paymentMethod: e.target.value as PaymentMethod })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Transfer">Bank Transfer</option>
                      <option value="QRIS">QRIS Politek IBC</option>
                      <option value="Cash">Cash / Tunai di IBC</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan Transaksi (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Catatan nomor referensi bank, cicilan ke-1, dsb..."
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Pembayaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Kirim Notice WA */}
      {whatsappModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-5 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Notifikasi Pembayaran WA</span>
                <h3 className="text-lg font-black text-slate-900">Kirim Pesan WhatsApp</h3>
              </div>
              <button onClick={() => setWhatsappModalPayment(null)} className="text-slate-400 font-bold hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-slate-700 block mb-1">Draf Pesan WhatsApp:</label>
              <textarea
                rows={6}
                value={customWaMessage}
                onChange={(e) => setCustomWaMessage(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setWhatsappModalPayment(null)}
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

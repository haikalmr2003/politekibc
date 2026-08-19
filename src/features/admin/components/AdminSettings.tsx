import React, { useEffect, useState } from 'react';
import { Database, RefreshCw, AlertCircle, CheckCircle2, MapPin, Save, Check } from 'lucide-react';
import { isSupabaseConfigured, DatabaseService } from '../../../services/database.service';
import { ContactSettings } from '../../../types';
import { POLITEK_INFO } from '../../../lib/config';

interface AdminSettingsProps {
  onRefreshData?: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onRefreshData }) => {
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    locationName: POLITEK_INFO.locationName,
    address: POLITEK_INFO.address,
    phone: POLITEK_INFO.phone,
    whatsappNumber: POLITEK_INFO.whatsappNumber,
    email: POLITEK_INFO.email,
    openingHours: POLITEK_INFO.openingHours,
    mapsEmbedUrl: POLITEK_INFO.mapsEmbedUrl,
    mapsUrl: POLITEK_INFO.mapsUrl
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    DatabaseService.getContactSettings().then((data) => {
      if (data) setContactSettings(data);
    });
  }, []);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await DatabaseService.updateContactSettings(contactSettings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert("Gagal menyimpan pengaturan kontak: " + err?.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Contact Settings Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Pengaturan Alamat & Kontak Politek IBC Jatibarang
          </h3>
          <p className="text-xs text-slate-500">
            Kelola alamat resmi, kontak WhatsApp, jam operasional, dan lokasi Google Maps yang ditampilkan di landing page.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan kontak Politek IBC Jatibarang berhasil diperbarui!</span>
          </div>
        )}

        <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lokasi Kampus</label>
              <input
                type="text"
                value={contactSettings.locationName}
                onChange={(e) => setContactSettings({ ...contactSettings, locationName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Pertanyaan Resmi</label>
              <input
                type="email"
                value={contactSettings.email}
                onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Telepon Utama</label>
              <input
                type="text"
                value={contactSettings.phone}
                onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Official (Format: 628xxx)</label>
              <input
                type="text"
                value={contactSettings.whatsappNumber}
                onChange={(e) => setContactSettings({ ...contactSettings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Alamat Resmi Kampus</label>
              <textarea
                rows={2}
                value={contactSettings.address}
                onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Jam Operasional Sekretariat</label>
              <input
                type="text"
                value={contactSettings.openingHours}
                onChange={(e) => setContactSettings({ ...contactSettings, openingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Google Maps Embed iframe URL</label>
              <input
                type="text"
                value={contactSettings.mapsEmbedUrl}
                onChange={(e) => setContactSettings({ ...contactSettings, mapsEmbedUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Link Petunjuk Arah Google Maps (Arah Navigasi)</label>
              <input
                type="text"
                value={contactSettings.mapsUrl}
                onChange={(e) => setContactSettings({ ...contactSettings, mapsUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan Kontak'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* System & Supabase Database Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Pengaturan Sistem & Database Supabase
          </h3>
          <p className="text-xs text-slate-500">
            Sistem secara penuh terintegrasi dengan PostgreSQL Supabase. Seluruh data peserta, hasil placement test, dan bank soal tersimpan secara tersentralisasi di cloud.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Status Integrasi Supabase:</span>
            <span className={`font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
              {isSupabaseConfigured ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SUPABASE ACTIVE</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>SUPABASE UNCONFIGURED</span>
                </>
              )}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-200">
            <p>• <strong>Tabel Placement Results:</strong> <code className="font-mono bg-slate-200 px-1 rounded">placement_results</code></p>
            <p>• <strong>Tabel Data Peserta:</strong> <code className="font-mono bg-slate-200 px-1 rounded">students</code></p>
            <p>• <strong>Tabel Bank Soal:</strong> <code className="font-mono bg-slate-200 px-1 rounded">placement_questions</code></p>
            <p>• <strong>Tabel Pengaturan Kontak:</strong> <code className="font-mono bg-slate-200 px-1 rounded">contact_settings</code></p>
          </div>
        </div>

        {onRefreshData && (
          <div className="pt-2">
            <button
              onClick={onRefreshData}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Muat Ulang Data Supabase</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

# 🎓 Politek IBC Jatibarang - Official Web Application & Placement Test Portal

Aplikasi resmi web portal **Politek IBC (International Brilliant College Jatibarang)** berbasis React 19, TypeScript, Vite, Tailwind CSS, Express, Supabase, dan Gemini AI.

---

## 🌟 Fitur Utama

- **🏛️ Landing Page Profil Lembaga**: Profil lengkap, legalitas BAN-PNF, keunggulan, fasilitas, galeri foto, testimoni, FAQ, dan peta lokasi interaktif.
- **📝 Placement Test Online**: Tes penempatan level otomatis (Bahasa Inggris & Komputer) dengan penghitungan skor real-time, CEFR level recommendation, diagnostik evaluasi AI, dan integrasi tombol WhatsApp (**08211409313**).
- **🎓 Student Portal**: Dashboard riwayat tes, unduh sertifikat, materi belajar, dan jadwal kelas.
- **🛡️ Admin Dashboard**: Panel pengelolaan bank soal, manajemen data siswa, rekap skor placement test, ekspor data Excel, dan monitoring pendaftar.
- **⚡ Database Supabase**: Sinkronisasi data real-time dengan skema SQL lengkap (`supabase_migration.sql`).

---

## 🚀 Panduan Menjalankan Secara Lokal (Local Development)

### 1. Prasyarat
- **Node.js**: v18.0.0 atau lebih baru
- **npm** atau **bun** / **yarn** / **pnpm**

### 2. Clone Repository & Install Dependensi
```bash
# Clone repository
git clone https://github.com/USERNAME/politek-ibc.git
cd politek-ibc

# Install packages
npm install
```

### 3. Konfigurasi Environment Variables (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi pada file `.env`:
```env
# Google Gemini API Key (Opsional untuk AI Placement Diagnostic)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Database Credentials
VITE_SUPABASE_URL=https://your-supabase-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Setup Database Supabase
1. Buka dashboard project di [Supabase](https://supabase.com).
2. Masuk ke menu **SQL Editor**.
3. Buka file `supabase_migration.sql` pada repository ini, salin seluruh isinya dan jalankan (**Run**) di SQL Editor Supabase.
4. Database tabel `placement_questions`, `test_results`, `students`, `courses`, `materials`, `schedules`, dan `settings` siap digunakan.

### 5. Jalankan Development Server
```bash
npm run dev
```
Akses aplikasi melalui browser di `http://localhost:3000`.

---

## 📦 Build & Production

```bash
# Melakukan kompilasi Vite dan Bundle Backend Express
npm run build

# Menjalankan server production
npm start
```

---

## 🌐 Panduan Deploy ke Platform Hosting

### A. Deploy ke Vercel (Rekomendasi untuk SPA / Frontend)
1. Push repository ini ke akun GitHub Anda.
2. Buka [Vercel Dashboard](https://vercel.com) dan klik **Add New Project** > **Import Git Repository**.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build` atau `vite build`.
5. Output Directory: `dist`.
6. Tambahkan Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Klik **Deploy**. (File `vercel.json` sudah disediakan untuk routing otomatis).

---

### B. Deploy ke Netlify
1. Buka [Netlify](https://netlify.com) dan pilih **Add new site** > **Import an existing project**.
2. Pilih repository GitHub Anda.
3. Build command: `npm run build` atau `npx vite build`.
4. Publish directory: `dist`.
5. Masukkan environment variables di **Site configuration** > **Environment variables**.
6. Klik **Deploy site**. (File `public/_redirects` sudah dikonfigurasi).

---

### C. Deploy Full-Stack ke Render / Railway / Cloud Run
1. Pilih **Web Service** dari GitHub repository.
2. Environment: **Node**.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Tambahkan Environment Variables (`GEMINI_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

---

## 📂 Struktur Direktori Proyek

```text
├── src/
│   ├── assets/              # Logo resmi Politek IBC & gambar
│   ├── components/shared/   # Navbar, Footer, Floating WhatsApp
│   ├── features/
│   │   ├── admin/           # Panel Admin & Manajemen Data
│   │   ├── auth/            # Halaman Login & Registrasi
│   │   ├── course/          # Katalog Program Kursus
│   │   ├── landing/         # Beranda & Informasi Profil
│   │   ├── placement-test/  # Engine Placement Test Online & Hasil
│   │   └── student/         # Dashboard & Histori Siswa
│   ├── lib/config.ts        # Informasi Kontak & Profil Politek IBC
│   ├── services/            # Service Supabase & Placement Engine
│   └── types.ts             # TypeScript Type Definitions
├── supabase_migration.sql   # Skrip DDL & Bank Soal Database Supabase
├── server.ts                # Server Full-Stack Express + Gemini AI Proxy
├── vite.config.ts           # Konfigurasi Vite & Tailwind CSS
├── vercel.json              # Konfigurasi SPA Routing Vercel
├── package.json             # Dependensi & NPM Scripts
└── README.md
```

---

## 📞 Kontak & Informasi Lembaga

- **Nama**: Politek IBC Jatibarang (International Brilliant College)
- **Alamat**: Jl. Tentara Pelajar No. 03, Jatibarang, Kab. Indramayu, Jawa Barat
- **WhatsApp**: [08211409313](https://wa.me/628211409313)
- **Email**: info@politek-ibc.ac.id
- **Berdiri**: Sejak 1985 (Terakreditasi BAN-PNF)

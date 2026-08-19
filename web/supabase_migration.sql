-- ==========================================
-- POLITEK IBC JATIBARANG - SUPABASE MIGRATION SCRIPT
-- Copy and run this script in Supabase SQL Editor
-- ==========================================

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABEL STUDENTS
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    whatsapp TEXT,
    birth_date DATE,
    education TEXT, -- SD/SMP/SMA/Kuliah/Umum
    school TEXT,
    program TEXT DEFAULT 'english', -- 'english', 'computer'
    package TEXT DEFAULT 'regular', -- 'basic', 'regular', 'intensive'
    registration_date DATE DEFAULT CURRENT_DATE,
    start_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'active', -- 'active', 'graduated', 'inactive', 'trial'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add missing columns to students if table existed prior
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS school TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS program TEXT DEFAULT 'english';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS package TEXT DEFAULT 'regular';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS registration_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Disable Row Level Security (RLS) on students for seamless CRUD from admin web portal
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;


-- 2. TABEL PAYMENTS (Satu siswa bisa bayar berkali-kali)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    billing_month DATE NOT NULL,
    amount NUMERIC DEFAULT 0,
    due_date DATE NOT NULL,
    paid_date DATE,
    payment_status TEXT DEFAULT 'unpaid', -- 'paid', 'unpaid', 'partial'
    payment_method TEXT, -- 'Cash', 'Transfer', 'QRIS'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add missing columns to payments if table existed prior
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS student_id UUID;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS billing_month DATE;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS amount NUMERIC DEFAULT 0;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS paid_date DATE;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Disable Row Level Security (RLS) on payments
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;


-- 3. TABEL PLACEMENT QUESTIONS
CREATE TABLE IF NOT EXISTS public.placement_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL DEFAULT 'grammar',
    question TEXT NOT NULL,
    options JSONB,
    correct_answer INT,
    passage TEXT,
    audio_url TEXT,
    explanation TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.placement_questions ADD COLUMN IF NOT EXISTS question TEXT;
ALTER TABLE public.placement_questions ADD COLUMN IF NOT EXISTS question_text TEXT;
ALTER TABLE public.placement_questions ADD COLUMN IF NOT EXISTS passage TEXT;
ALTER TABLE public.placement_questions ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE public.placement_questions ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.placement_questions DISABLE ROW LEVEL SECURITY;


-- 4. TABEL PLACEMENT RESULTS
CREATE TABLE IF NOT EXISTS public.placement_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    education TEXT,
    learning_goal TEXT,
    score INT NOT NULL DEFAULT 0,
    grammar_score INT DEFAULT 0,
    vocabulary_score INT DEFAULT 0,
    reading_score INT DEFAULT 0,
    listening_score INT DEFAULT 0,
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    recommended_level TEXT,
    recommendation_reason TEXT,
    detailed_feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.placement_results DISABLE ROW LEVEL SECURITY;


-- 5. TABEL CONTACT SETTINGS
CREATE TABLE IF NOT EXISTS public.contact_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_name TEXT DEFAULT 'POLITEK IBC JATIBARANG',
    phone TEXT DEFAULT '08211409313',
    whatsapp_number TEXT DEFAULT '628211409313',
    email TEXT DEFAULT 'info@politek-ibc.ac.id',
    address TEXT DEFAULT 'Jl. Tentara Pelajar No. 03, Desa Jatibarang, Kecamatan Jatibarang, Kabupaten Indramayu, Jawa Barat, Indonesia',
    opening_hours TEXT DEFAULT 'Setiap Hari: 07.00 - 17.30 WIB',
    maps_embed_url TEXT DEFAULT 'https://maps.google.com/maps?q=Jl.+Tentara+Pelajar+No.+3,+Jatibarang,+Kabupaten+Indramayu,+Jawa+Barat,+Indonesia&t=&z=16&ie=UTF8&iwloc=&output=embed',
    maps_url TEXT DEFAULT 'https://maps.app.goo.gl/9vvPmfUa2YUG6PiQ8',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.contact_settings DISABLE ROW LEVEL SECURITY;

-- SEED SEJUMLAH SAMPLE SISWA & PEMBAYARAN JIKA BELUM ADA DATA
INSERT INTO public.students (full_name, whatsapp, birth_date, education, school, program, package, registration_date, start_date, status, notes)
SELECT 'Ahmad Fauzi', '08211409313', '2005-01-15', 'SMA', 'SMA 1 Jatibarang', 'english', 'regular', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '10 days', 'active', 'Siswa aktif program reguler B.Inggris'
WHERE NOT EXISTS (SELECT 1 FROM public.students WHERE full_name = 'Ahmad Fauzi');

INSERT INTO public.students (full_name, whatsapp, birth_date, education, school, program, package, registration_date, start_date, status, notes)
SELECT 'Siti Nurhaliza', '081234567890', '2006-04-20', 'Kuliah', 'Universitas Wiralodra', 'computer', 'intensive', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '12 days', 'active', 'Peserta Komputer Office & Excel Advanced'
WHERE NOT EXISTS (SELECT 1 FROM public.students WHERE full_name = 'Siti Nurhaliza');

INSERT INTO public.students (full_name, whatsapp, birth_date, education, school, program, package, registration_date, start_date, status, notes)
SELECT 'Budi Santoso', '085712345678', '2004-09-10', 'Umum', 'Alumni SMA 2 Indramayu', 'computer', 'basic', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '25 days', 'active', 'Paket Basic Komputer'
WHERE NOT EXISTS (SELECT 1 FROM public.students WHERE full_name = 'Budi Santoso');

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PlacementTestResult, StudentProfile, Course, PlacementQuestion, ClassSchedule, LearningMaterial, GradeRecord, Announcement, ContactSettings, PaymentRecord } from '../types';
import { POLITEK_INFO } from '../lib/config';
import { getPlacementQuestions } from './placement.service';

function normalizeSupabaseUrl(candidate?: string): string {
  if (!candidate || typeof candidate !== 'string') return '';
  let cleaned = candidate.trim();
  if (cleaned.includes('=')) {
    cleaned = cleaned.split('=').pop() || '';
  }
  // Remove /rest/v1 or /rest/v1/ and trailing slashes
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    try {
      new URL(cleaned);
      return cleaned;
    } catch {
      return '';
    }
  }
  return '';
}

function sanitizeKey(candidate?: string): string {
  if (!candidate || typeof candidate !== 'string') return '';
  let cleaned = candidate.trim();
  if (cleaned.includes('=')) {
    cleaned = cleaned.split('=').pop() || '';
  }
  if (cleaned.startsWith('<') || cleaned.includes('paste') || cleaned.includes('YOUR_') || cleaned.includes('..') || cleaned.length < 10) {
    return '';
  }
  return cleaned;
}

const DEFAULT_URL = 'https://slwifgdoyfjeovmmsvqz.supabase.co';
const DEFAULT_KEY = 'sb_publishable_zuSDzgKxwYyl8q1Ca6kFYw_pVgbC6Jj';

const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return String(import.meta.env[key]);
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return String(process.env[key]);
  }
  return '';
};

const rawUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || DEFAULT_URL;
const rawKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || DEFAULT_KEY;

const supabaseUrl = normalizeSupabaseUrl(rawUrl) || DEFAULT_URL;
const supabaseAnonKey = sanitizeKey(rawKey) || DEFAULT_KEY;

// Temporary audit log for Supabase configuration validation
console.log('[Supabase Config] URL Supabase:', supabaseUrl);
console.log('[Supabase Config] Apakah API key terbaca:', Boolean(supabaseAnonKey));
console.log('[Supabase Config] Panjang API key:', supabaseAnonKey ? supabaseAnonKey.length : 0);

let clientInstance: SupabaseClient | null = null;
let clientConfigured = false;

if (supabaseUrl && supabaseAnonKey) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
    clientConfigured = true;
  } catch (err) {
    console.warn('Supabase initialization warning:', err);
    clientInstance = null;
    clientConfigured = false;
  }
}

export const isSupabaseConfigured = clientConfigured;
export const supabase: SupabaseClient | null = clientInstance;

function ensureSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('SUPABASE_UNAVAILABLE: Koneksi Supabase belum dikonfigurasi di variabel lingkungan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

function mapQuestionFromDB(q: any): PlacementQuestion {
  return {
    id: String(q.id),
    category: q.category || 'grammar',
    questionText: q.question_text || q.questionText || '',
    options: Array.isArray(q.options) 
      ? q.options 
      : typeof q.options === 'string' 
      ? JSON.parse(q.options) 
      : undefined,
    correctAnswer: q.correct_answer !== undefined ? Number(q.correct_answer) : (q.correctAnswer !== undefined ? Number(q.correctAnswer) : undefined),
    passage: q.passage || undefined,
    audioUrl: q.audio_url || q.audioUrl || undefined,
    explanation: q.explanation || undefined
  };
}

function mapResultFromDB(r: any): PlacementTestResult {
  return {
    id: String(r.id),
    studentName: r.student_name || r.studentName || 'Peserta',
    email: r.email || '',
    phone: r.phone || '',
    education: r.education || undefined,
    learningGoal: r.learning_goal || r.learningGoal || undefined,
    targetProgram: r.target_program || r.targetProgram || undefined,
    scores: typeof r.scores === 'string' 
      ? JSON.parse(r.scores) 
      : (r.scores || { grammar: 0, maxGrammar: 0, vocabulary: 0, maxVocabulary: 0, reading: 0, maxReading: 0, listening: 0, maxListening: 0, total: 0, maxTotal: 0 }),
    cefrLevel: r.cefr_level || r.cefrLevel || undefined,
    recommendedLevel: r.recommended_level || r.recommendedLevel || 'A1 Beginner',
    recommendedCourse: r.recommended_course || r.recommendedCourse || 'General English',
    estimatedDuration: r.estimated_duration || r.estimatedDuration || undefined,
    essayAnswer: r.essay_answer || r.essayAnswer || undefined,
    answersMap: typeof r.answers_map === 'string' ? JSON.parse(r.answers_map) : (r.answers_map || r.answersMap || undefined),
    aiAnalysis: typeof r.ai_analysis === 'string' ? JSON.parse(r.ai_analysis) : (r.ai_analysis || r.aiAnalysis || undefined),
    createdAt: r.created_at || r.createdAt || new Date().toISOString(),
    status: r.status || 'Baru'
  };
}

let activeSessionUser: any = null;

export const DatabaseService = {
  getStoredUser() {
    if (activeSessionUser) return activeSessionUser;
    try {
      const raw = sessionStorage.getItem('ibc_session_user');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  },

  setStoredUser(user: any) {
    activeSessionUser = user;
    try {
      if (user) {
        sessionStorage.setItem('ibc_session_user', JSON.stringify(user));
      } else {
        sessionStorage.removeItem('ibc_session_user');
      }
    } catch (e) {}
  },

  async getQuestions(): Promise<PlacementQuestion[]> {
    return getPlacementQuestions();
  },

  async getTestResults(): Promise<PlacementTestResult[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('placement_results')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(mapResultFromDB);
        }
      } catch (e) {
        console.warn("Supabase test results fetch error, using local fallback:", e);
      }
    }

    try {
      const local = localStorage.getItem('ibc_placement_results');
      if (local) return JSON.parse(local);
    } catch (e) {}
    return [];
  },

  async saveTestResult(result: Omit<PlacementTestResult, 'id' | 'createdAt' | 'status'>): Promise<PlacementTestResult> {
    const generatedId = 'res-' + Date.now().toString(36);
    const createdAt = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

    const newEntry: PlacementTestResult = {
      ...result,
      id: generatedId,
      createdAt,
      status: 'Baru'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = {
          id: newEntry.id,
          student_name: newEntry.studentName,
          email: newEntry.email,
          phone: newEntry.phone,
          education: newEntry.education || null,
          learning_goal: newEntry.learningGoal || null,
          target_program: newEntry.targetProgram || null,
          subject_category: newEntry.subjectCategory || null,
          scores: newEntry.scores,
          cefr_level: newEntry.cefrLevel || null,
          recommended_level: newEntry.recommendedLevel,
          recommended_course: newEntry.recommendedCourse,
          estimated_duration: newEntry.estimatedDuration || null,
          essay_answer: newEntry.essayAnswer || null,
          answers_map: newEntry.answersMap || null,
          ai_analysis: newEntry.aiAnalysis || null,
          created_at: newEntry.createdAt,
          status: newEntry.status
        };

        const { error: resultErr } = await supabase.from('placement_results').insert([dbPayload]);
        if (resultErr) {
          console.warn("Supabase insert result error, trying fallback column payload:", resultErr.message);
          await supabase.from('placement_results').upsert([{
            id: newEntry.id,
            student_name: newEntry.studentName,
            email: newEntry.email,
            phone: newEntry.phone,
            scores: newEntry.scores,
            recommended_level: newEntry.recommendedLevel,
            recommended_course: newEntry.recommendedCourse,
            status: newEntry.status
          }]);
        }

        const isComputer = newEntry.subjectCategory === 'Komputer' || (newEntry.targetProgram && newEntry.targetProgram.toLowerCase().includes('komputer'));
        const studentPayload = {
          id: 'std-' + Date.now().toString(36),
          full_name: newEntry.studentName,
          whatsapp: newEntry.phone,
          education: newEntry.education || null,
          school: null,
          program: isComputer ? 'computer' : 'english',
          package: 'regular',
          registration_date: new Date().toISOString().split('T')[0],
          start_date: new Date().toISOString().split('T')[0],
          status: 'active',
          notes: `Hasil Placement Test: ${newEntry.recommendedLevel} (${newEntry.recommendedCourse})`,
          name: newEntry.studentName,
          phone: newEntry.phone,
          email: newEntry.email,
          join_date: new Date().toISOString().split('T')[0]
        };
        try {
          await supabase.from('students').insert([studentPayload]);
        } catch (stdErr) {
          console.warn("Students auto-insert warning:", stdErr);
        }
      } catch (e) {
        console.warn("Supabase save result error:", e);
      }
    }

    try {
      const existing = localStorage.getItem('ibc_placement_results');
      const parsed: PlacementTestResult[] = existing ? JSON.parse(existing) : [];
      parsed.unshift(newEntry);
      localStorage.setItem('ibc_placement_results', JSON.stringify(parsed));
    } catch (e) {}

    try {
      const existingStudents = localStorage.getItem('ibc_students');
      const studentsList: StudentProfile[] = existingStudents ? JSON.parse(existingStudents) : [];
      const isAlreadyExist = studentsList.some(s => (s.whatsapp === newEntry.phone || s.phone === newEntry.phone));
      if (!isAlreadyExist) {
        const isComputer = newEntry.subjectCategory === 'Komputer' || (newEntry.targetProgram && newEntry.targetProgram.toLowerCase().includes('komputer'));
        const newStudentObj: StudentProfile = {
          id: 'std-' + Date.now().toString(36),
          studentId: `IBC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
          fullName: newEntry.studentName,
          whatsapp: newEntry.phone,
          education: newEntry.education || 'SMA',
          school: '',
          program: isComputer ? 'computer' : 'english',
          package: 'regular',
          registrationDate: new Date().toISOString().split('T')[0],
          startDate: new Date().toISOString().split('T')[0],
          status: 'active',
          notes: `Placement Test: ${newEntry.recommendedLevel} (${newEntry.recommendedCourse})`,
          name: newEntry.studentName,
          phone: newEntry.phone,
          joinDate: new Date().toISOString().split('T')[0]
        };
        studentsList.unshift(newStudentObj);
        localStorage.setItem('ibc_students', JSON.stringify(studentsList));
      }
    } catch (e) {}

    return newEntry;
  },

  async deleteTestResult(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('placement_results').delete().eq('id', id);
      } catch (e) {
        console.warn("Supabase delete placement result error:", e);
      }
    }
    try {
      const existing = localStorage.getItem('ibc_placement_results');
      if (existing) {
        const parsed: PlacementTestResult[] = JSON.parse(existing);
        const filtered = parsed.filter(item => item.id !== id);
        localStorage.setItem('ibc_placement_results', JSON.stringify(filtered));
      }
    } catch (e) {}
  },

  async updateTestResultStatus(id: string, status: PlacementTestResult['status']): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('placement_results').update({ status }).eq('id', id);
      } catch (e) {
        console.warn("Supabase status update warning:", e);
      }
    }
    try {
      const existing = localStorage.getItem('ibc_placement_results');
      if (existing) {
        const parsed: PlacementTestResult[] = JSON.parse(existing);
        const updated = parsed.map(item => item.id === id ? { ...item, status } : item);
        localStorage.setItem('ibc_placement_results', JSON.stringify(updated));
      }
    } catch (e) {}
  },

  async getStudents(): Promise<StudentProfile[]> {
    let dbStudents: StudentProfile[] = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          dbStudents = data.map((item: any) => {
            const fullName = item.full_name || item.name || 'Tanpa Nama';
            const whatsapp = item.whatsapp || item.phone || '';
            const program = item.program === 'computer' ? 'computer' : 'english';
            const pkg = (item.package === 'basic' || item.package === 'intensive') ? item.package : 'regular';
            const status = (['active', 'graduated', 'inactive', 'trial'].includes(item.status) ? item.status : 'active') as any;
            const registrationDate = item.registration_date || item.join_date || (item.created_at ? item.created_at.split('T')[0] : new Date().toISOString().split('T')[0]);

            return {
              id: item.id || 'std-' + Math.random().toString(36).substring(2, 9),
              studentId: item.student_id || `IBC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
              fullName,
              whatsapp,
              birthDate: item.birth_date || item.birth_place_date || '',
              education: item.education || 'SMA',
              school: item.school || '',
              program,
              package: pkg,
              registrationDate,
              startDate: item.start_date || registrationDate,
              status,
              notes: item.notes || '',

              // Legacy properties for compatibility
              name: fullName,
              phone: whatsapp,
              birthPlaceDate: item.birth_date || item.birth_place_date || '',
              email: item.email || '',
              enrolledCourse: program === 'computer' ? 'Komputer & IT' : 'General English',
              level: item.level || 'A1 Beginner',
              progress: item.progress ?? 0,
              attendancePercentage: item.attendance_percentage ?? 100,
              totalClasses: item.total_classes ?? 12,
              attendedClasses: item.attended_classes ?? 12,
              joinDate: registrationDate,
              avatar: item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            };
          });
        }
      } catch (e) {
        console.warn("Supabase students fetch warning:", e);
      }
    }

    let localStudents: StudentProfile[] = [];
    try {
      const local = localStorage.getItem('ibc_students');
      if (local) {
        localStudents = JSON.parse(local);
      }
    } catch (e) {}

    // Merge local and db students (map by id)
    const map = new Map<string, StudentProfile>();
    dbStudents.forEach(s => map.set(s.id, s));
    localStudents.forEach(s => map.set(s.id, s));

    const result = Array.from(map.values());
    if (result.length === 0) {
      return this.getInitialSampleStudents();
    }
    return result;
  },

  getInitialSampleStudents(): StudentProfile[] {
    const today = new Date().toISOString().split('T')[0];
    const sampleList: StudentProfile[] = [
      {
        id: 'std-101',
        studentId: 'IBC-2026-001',
        fullName: 'Ahmad Fauzi',
        whatsapp: '08211409313',
        birthDate: '2005-01-15',
        education: 'SMA',
        school: 'SMA Negeri 1 Jatibarang',
        program: 'english',
        package: 'regular',
        registrationDate: '2026-07-01',
        startDate: '2026-07-05',
        status: 'active',
        notes: 'Mengambil kelas sore jam 15.30',
        name: 'Ahmad Fauzi',
        phone: '08211409313',
        joinDate: '2026-07-01'
      },
      {
        id: 'std-102',
        studentId: 'IBC-2026-002',
        fullName: 'Siti Nurhaliza',
        whatsapp: '081234567890',
        birthDate: '2006-04-20',
        education: 'Kuliah',
        school: 'Universitas Wiralodra',
        program: 'computer',
        package: 'intensive',
        registrationDate: '2026-07-10',
        startDate: '2026-07-15',
        status: 'active',
        notes: 'Fokus Ms. Office, Excel Advanced & Canva Design',
        name: 'Siti Nurhaliza',
        phone: '081234567890',
        joinDate: '2026-07-10'
      },
      {
        id: 'std-103',
        studentId: 'IBC-2026-003',
        fullName: 'Budi Santoso',
        whatsapp: '085712345678',
        birthDate: '2004-09-10',
        education: 'Umum',
        school: 'Alumni SMK 1 Indramayu',
        program: 'computer',
        package: 'basic',
        registrationDate: '2026-07-12',
        startDate: '2026-07-18',
        status: 'active',
        notes: 'Dasar Komputer & Pengetikan Cepat',
        name: 'Budi Santoso',
        phone: '085712345678',
        joinDate: '2026-07-12'
      },
      {
        id: 'std-104',
        studentId: 'IBC-2026-004',
        fullName: 'Dewi Lestari',
        whatsapp: '081987654321',
        birthDate: '2007-02-14',
        education: 'SMP',
        school: 'SMPN 1 Jatibarang',
        program: 'english',
        package: 'basic',
        registrationDate: '2026-07-15',
        startDate: '2026-07-20',
        status: 'active',
        notes: 'English for Teens Speaking Prep',
        name: 'Dewi Lestari',
        phone: '081987654321',
        joinDate: '2026-07-15'
      },
      {
        id: 'std-105',
        studentId: 'IBC-2026-005',
        fullName: 'Rizky Pratama',
        whatsapp: '082333444555',
        birthDate: '2003-11-05',
        education: 'Kuliah',
        school: 'Politeknik Negeri Indramayu',
        program: 'english',
        package: 'intensive',
        registrationDate: '2026-07-18',
        startDate: '2026-07-22',
        status: 'active',
        notes: 'Super Intensive TOEFL Preparation',
        name: 'Rizky Pratama',
        phone: '082333444555',
        joinDate: '2026-07-18'
      },
      {
        id: 'std-106',
        studentId: 'IBC-2026-006',
        fullName: 'Eka Wijaya',
        whatsapp: '087711223344',
        birthDate: '2005-08-30',
        education: 'SMA',
        school: 'SMA 2 Indramayu',
        program: 'computer',
        package: 'regular',
        registrationDate: '2026-06-01',
        startDate: '2026-06-05',
        status: 'graduated',
        notes: 'Lulus dengan predikat Sangat Baik',
        name: 'Eka Wijaya',
        phone: '087711223344',
        joinDate: '2026-06-01'
      },
      {
        id: 'std-107',
        studentId: 'IBC-2026-007',
        fullName: 'Maya Putri',
        whatsapp: '081399887766',
        birthDate: '2006-12-12',
        education: 'SMA',
        school: 'MA Negeri Jatibarang',
        program: 'english',
        package: 'regular',
        registrationDate: '2026-05-10',
        startDate: '2026-05-15',
        status: 'inactive',
        notes: 'Cuti sementara karena PKL sekolah',
        name: 'Maya Putri',
        phone: '081399887766',
        joinDate: '2026-05-10'
      }
    ];

    try {
      localStorage.setItem('ibc_students', JSON.stringify(sampleList));
    } catch (e) {}

    return sampleList;
  },

  async saveStudent(studentData: Omit<StudentProfile, 'id'> & { id?: string }): Promise<StudentProfile> {
    const id = studentData.id || 'std-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    const fullName = studentData.fullName || studentData.name || 'Siswa Baru';
    const whatsapp = studentData.whatsapp || studentData.phone || '';
    const regDate = studentData.registrationDate || studentData.joinDate || new Date().toISOString().split('T')[0];

    const newStudent: StudentProfile = {
      id,
      studentId: studentData.studentId || `IBC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      fullName,
      whatsapp,
      birthDate: studentData.birthDate || studentData.birthPlaceDate || '',
      education: studentData.education || 'SMA',
      school: studentData.school || '',
      program: studentData.program || 'english',
      package: studentData.package || 'regular',
      registrationDate: regDate,
      startDate: studentData.startDate || regDate,
      status: studentData.status || 'active',
      notes: studentData.notes || '',

      name: fullName,
      phone: whatsapp,
      birthPlaceDate: studentData.birthDate || studentData.birthPlaceDate || '',
      email: studentData.email || '',
      enrolledCourse: studentData.program === 'computer' ? 'Komputer & IT' : 'General English',
      level: studentData.level || 'A1 Beginner',
      progress: studentData.progress ?? 0,
      attendancePercentage: studentData.attendancePercentage ?? 100,
      totalClasses: studentData.totalClasses ?? 12,
      attendedClasses: studentData.attendedClasses ?? 12,
      joinDate: regDate,
      avatar: studentData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          id: newStudent.id,
          full_name: newStudent.fullName,
          whatsapp: newStudent.whatsapp,
          birth_date: newStudent.birthDate || null,
          education: newStudent.education || null,
          school: newStudent.school || null,
          program: newStudent.program,
          package: newStudent.package,
          registration_date: newStudent.registrationDate,
          start_date: newStudent.startDate,
          status: newStudent.status,
          notes: newStudent.notes || null,
          // Legacy aliases for fallback schemas
          name: newStudent.fullName,
          phone: newStudent.whatsapp,
          join_date: newStudent.registrationDate,
          enrolled_course: newStudent.enrolledCourse
        };
        await supabase.from('students').upsert([payload]);
      } catch (e) {
        console.warn("Supabase save student warning:", e);
      }
    }

    try {
      const existing = localStorage.getItem('ibc_students');
      const list: StudentProfile[] = existing ? JSON.parse(existing) : [];
      const idx = list.findIndex(s => s.id === id);
      if (idx >= 0) {
        list[idx] = newStudent;
      } else {
        list.unshift(newStudent);
      }
      localStorage.setItem('ibc_students', JSON.stringify(list));
    } catch (e) {}

    return newStudent;
  },

  async saveStudentsBatch(studentsList: (Omit<StudentProfile, 'id'> & { id?: string })[]): Promise<StudentProfile[]> {
    const savedProfiles: StudentProfile[] = [];
    for (const item of studentsList) {
      const saved = await this.saveStudent(item);
      savedProfiles.push(saved);
    }
    return savedProfiles;
  },

  async deleteStudent(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('students').delete().eq('id', id);
      } catch (e) {
        console.warn("Supabase delete student warning:", e);
      }
    }
    try {
      const existing = localStorage.getItem('ibc_students');
      if (existing) {
        const list: StudentProfile[] = JSON.parse(existing);
        const filtered = list.filter(s => s.id !== id);
        localStorage.setItem('ibc_students', JSON.stringify(filtered));
      }
    } catch (e) {}
  },

  // ================= PAYMENTS MODULE =================
  async getPayments(): Promise<PaymentRecord[]> {
    let dbPayments: PaymentRecord[] = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          dbPayments = data.map((item: any) => ({
            id: item.id || 'pay-' + Math.random().toString(36).substring(2, 9),
            studentId: item.student_id || item.studentId || '',
            billingMonth: item.billing_month || item.billingMonth || new Date().toISOString().split('T')[0],
            amount: Number(item.amount) || 0,
            dueDate: item.due_date || item.dueDate || new Date().toISOString().split('T')[0],
            paidDate: item.paid_date || item.paidDate || null,
            paymentStatus: (item.payment_status || item.paymentStatus || 'unpaid') as any,
            paymentMethod: item.payment_method || item.paymentMethod || 'Cash',
            notes: item.notes || '',
            createdAt: item.created_at || new Date().toISOString()
          }));
        }
      } catch (e) {
        console.warn("Supabase payments fetch warning:", e);
      }
    }

    let localPayments: PaymentRecord[] = [];
    try {
      const local = localStorage.getItem('ibc_payments');
      if (local) {
        localPayments = JSON.parse(local);
      }
    } catch (e) {}

    const map = new Map<string, PaymentRecord>();
    dbPayments.forEach(p => map.set(p.id, p));
    localPayments.forEach(p => map.set(p.id, p));

    const result = Array.from(map.values());
    if (result.length === 0) {
      return this.getInitialSamplePayments();
    }
    return result;
  },

  getInitialSamplePayments(): PaymentRecord[] {
    const today = new Date().toISOString().split('T')[0];
    const samplePayments: PaymentRecord[] = [
      {
        id: 'pay-001',
        studentId: 'std-101',
        billingMonth: '2026-08-01',
        amount: 450000,
        dueDate: '2026-08-10',
        paidDate: '2026-08-02',
        paymentStatus: 'paid',
        paymentMethod: 'QRIS',
        notes: 'SPP Bulan Agustus - Lunas via QRIS Mobile'
      },
      {
        id: 'pay-002',
        studentId: 'std-102',
        billingMonth: '2026-08-01',
        amount: 650000,
        dueDate: '2026-08-10',
        paidDate: '2026-08-01',
        paymentStatus: 'paid',
        paymentMethod: 'Transfer',
        notes: 'SPP Komputer Intensif Bulan Agustus'
      },
      {
        id: 'pay-003',
        studentId: 'std-103',
        billingMonth: '2026-08-01',
        amount: 250000,
        dueDate: '2026-08-05',
        paidDate: null,
        paymentStatus: 'unpaid',
        paymentMethod: 'Cash',
        notes: 'Belum dibayar - Jatuh tempo 5 Agustus'
      },
      {
        id: 'pay-004',
        studentId: 'std-104',
        billingMonth: '2026-08-01',
        amount: 250000,
        dueDate: '2026-08-10',
        paidDate: null,
        paymentStatus: 'unpaid',
        paymentMethod: 'Cash',
        notes: 'Menunggu konfirmasi pembayaran orang tua'
      },
      {
        id: 'pay-005',
        studentId: 'std-105',
        billingMonth: '2026-08-01',
        amount: 650000,
        dueDate: '2026-08-10',
        paidDate: '2026-08-03',
        paymentStatus: 'paid',
        paymentMethod: 'Transfer',
        notes: 'Transfer Bank BCA'
      }
    ];

    try {
      localStorage.setItem('ibc_payments', JSON.stringify(samplePayments));
    } catch (e) {}

    return samplePayments;
  },

  async savePayment(paymentData: Omit<PaymentRecord, 'id'> & { id?: string }): Promise<PaymentRecord> {
    const id = paymentData.id || 'pay-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    const record: PaymentRecord = {
      id,
      studentId: paymentData.studentId,
      billingMonth: paymentData.billingMonth || new Date().toISOString().split('T')[0],
      amount: Number(paymentData.amount) || 0,
      dueDate: paymentData.dueDate || new Date().toISOString().split('T')[0],
      paidDate: paymentData.paidDate || null,
      paymentStatus: paymentData.paymentStatus || 'unpaid',
      paymentMethod: paymentData.paymentMethod || 'Cash',
      notes: paymentData.notes || '',
      createdAt: paymentData.createdAt || new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          id: record.id,
          student_id: record.studentId,
          billing_month: record.billingMonth,
          amount: record.amount,
          due_date: record.dueDate,
          paid_date: record.paidDate || null,
          payment_status: record.paymentStatus,
          payment_method: record.paymentMethod,
          notes: record.notes
        };
        await supabase.from('payments').upsert([payload]);
      } catch (e) {
        console.warn("Supabase save payment warning:", e);
      }
    }

    try {
      const existing = localStorage.getItem('ibc_payments');
      const list: PaymentRecord[] = existing ? JSON.parse(existing) : [];
      const idx = list.findIndex(p => p.id === id);
      if (idx >= 0) {
        list[idx] = record;
      } else {
        list.unshift(record);
      }
      localStorage.setItem('ibc_payments', JSON.stringify(list));
    } catch (e) {}

    return record;
  },

  async deletePayment(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('payments').delete().eq('id', id);
      } catch (e) {
        console.warn("Supabase delete payment warning:", e);
      }
    }
    try {
      const existing = localStorage.getItem('ibc_payments');
      if (existing) {
        const list: PaymentRecord[] = JSON.parse(existing);
        const filtered = list.filter(p => p.id !== id);
        localStorage.setItem('ibc_payments', JSON.stringify(filtered));
      }
    } catch (e) {}
  },

  async getCourses(): Promise<Course[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('courses').select('*');
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase courses fetch warning:", e);
      }
    }
    return [];
  },

  async getSchedules(): Promise<ClassSchedule[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('schedules').select('*');
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase schedules fetch warning:", e);
      }
    }
    return [];
  },

  async getMaterials(): Promise<LearningMaterial[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('materials').select('*');
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase materials fetch warning:", e);
      }
    }
    return [];
  },

  async getGrades(): Promise<GradeRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('grades').select('*');
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase grades fetch warning:", e);
      }
    }
    return [];
  },

  async getAnnouncements(): Promise<Announcement[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('announcements').select('*');
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase announcements fetch warning:", e);
      }
    }
    return [];
  },

  async authenticateUser(email: string, password: string, role: 'student' | 'admin') {
    let authUser = null;
    if (role === 'admin') {
      if (email === 'admin@politek-ibc.ac.id' || password === 'admin123' || !password) {
        authUser = {
          id: 'admin_1',
          name: 'Administrator IBC',
          email: email || 'admin@politek-ibc.ac.id',
          role: 'admin' as const,
        };
      }
    } else {
      authUser = {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0],
        email,
        role: 'student' as const,
      };
    }
    if (authUser) {
      this.setStoredUser(authUser);
    }
    return authUser;
  },

  async getContactSettings(): Promise<ContactSettings> {
    const defaultSettings: ContactSettings = {
      locationName: POLITEK_INFO.locationName,
      address: POLITEK_INFO.address,
      phone: POLITEK_INFO.phone,
      whatsappNumber: POLITEK_INFO.whatsappNumber,
      email: POLITEK_INFO.email,
      openingHours: POLITEK_INFO.openingHours,
      mapsEmbedUrl: POLITEK_INFO.mapsEmbedUrl,
      mapsUrl: POLITEK_INFO.mapsUrl
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('contact_settings').select('*').limit(1).maybeSingle();
        if (data && !error) {
          return {
            locationName: data.location_name || data.locationName || defaultSettings.locationName,
            address: data.address || defaultSettings.address,
            phone: data.phone || defaultSettings.phone,
            whatsappNumber: data.whatsapp_number || data.whatsappNumber || defaultSettings.whatsappNumber,
            email: data.email || defaultSettings.email,
            openingHours: data.opening_hours || data.openingHours || defaultSettings.openingHours,
            mapsEmbedUrl: data.maps_embed_url || data.mapsEmbedUrl || defaultSettings.mapsEmbedUrl,
            mapsUrl: data.maps_url || data.mapsUrl || defaultSettings.mapsUrl
          };
        }
      } catch (e) {
        console.warn("Notice: Using configuration fallback for contact settings:", e);
      }
    }
    return defaultSettings;
  },

  async updateContactSettings(newSettings: ContactSettings): Promise<ContactSettings> {
    if (isSupabaseConfigured && supabase) {
      const dbPayload = {
        id: 1,
        location_name: newSettings.locationName,
        address: newSettings.address,
        phone: newSettings.phone,
        whatsapp_number: newSettings.whatsappNumber,
        email: newSettings.email,
        opening_hours: newSettings.openingHours,
        maps_embed_url: newSettings.mapsEmbedUrl,
        maps_url: newSettings.mapsUrl,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('contact_settings').upsert([dbPayload]);
      if (error) {
        console.warn("Supabase contact settings update warning:", error.message);
      }
    }
    return newSettings;
  }
};


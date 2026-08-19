export type LevelType = 
  | 'A1 Beginner' 
  | 'A2 Elementary' 
  | 'B1 Intermediate' 
  | 'B2 Upper-Intermediate' 
  | 'C1 Advanced'
  | 'A1 - B2'
  | 'Intermediate - Advanced'
  | 'All Levels';

export type CourseCategory = 
  | 'General English' 
  | 'Exam Prep' 
  | 'Business & Career' 
  | 'Kids & Teens' 
  | 'Speaking & Conversation' 
  | 'Conversation'
  | 'Private & Executive'
  | 'Bahasa Inggris'
  | 'Komputer'
  | 'Super Intensif';

export interface Course {
  id: string;
  title: string;
  code?: string;
  category: CourseCategory;
  level: LevelType | 'Semua Tingkat' | string;
  duration?: string; // e.g., '3 Bulan (24 Sesi)'
  durationWeeks?: number;
  totalHours?: number;
  price: number;
  discountPrice?: number;
  description: string;
  features: string[];
  scheduleOptions: string[];
  syllabus?: string[];
  targetAudience?: string;
  image?: string;
  thumbnailUrl?: string;
  isPopular?: boolean;
}

export type TestSubjectCategory = 'B.inggris' | 'Komputer';

export type QuestionCategory = 
  | 'grammar' 
  | 'vocabulary' 
  | 'reading' 
  | 'listening' 
  | 'essay' 
  | 'Grammar'
  | 'Vocabulary'
  | 'Reading'
  | 'Basic Computer' 
  | 'Office Productivity' 
  | 'Digital Productivity'
  | string;

export interface PlacementQuestion {
  id: string;
  category: QuestionCategory;
  subjectCategory?: TestSubjectCategory;
  questionText: string;
  passage?: string;
  audioUrl?: string;
  options?: string[]; // for MCQs
  correctAnswer?: number; // 0-indexed for MCQs
  explanation?: string;
  isActive?: boolean;
}

export type Question = PlacementQuestion;

export interface AIAnalysisResult {
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  suggestedFocus: string;
}

export interface StudentBiodata {
  studentName: string;
  email: string;
  phone: string;
  education: string;
  learningGoal: string;
  targetProgram: string;
}

export interface PlacementTestResult {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  education?: string;
  learningGoal?: string;
  targetProgram?: string;
  subjectCategory?: TestSubjectCategory;
  scores: {
    grammar: number;
    maxGrammar: number;
    vocabulary: number;
    maxVocabulary: number;
    reading: number;
    maxReading: number;
    listening: number;
    maxListening: number;
    total: number;
    maxTotal: number;
    categoryBreakdown?: Record<string, { correct: number; total: number }>;
  };
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | string;
  recommendedLevel: LevelType | string;
  recommendedCourse: string;
  estimatedDuration?: string;
  essayAnswer?: string;
  answersMap?: Record<string, number>;
  aiAnalysis?: AIAnalysisResult;
  createdAt: string;
  status: 'Baru' | 'Dihubungi' | 'Terdaftar' | 'Batal';
}

export type StudentProgram = 'english' | 'computer';
export type StudentPackage = 'basic' | 'regular' | 'intensive';
export type StudentStatus = 'active' | 'graduated' | 'inactive' | 'trial';

export interface StudentProfile {
  id: string; // UUID from Supabase
  studentId?: string; // e.g. IBC-2026-001
  fullName: string; // full_name
  whatsapp: string; // whatsapp (Nomor WA)
  birthDate?: string; // birth_date
  education?: 'SD' | 'SMP' | 'SMA' | 'Kuliah' | 'Umum' | string; // education
  school?: string; // school
  program: StudentProgram; // 'english' | 'computer'
  package: StudentPackage; // 'basic' | 'regular' | 'intensive'
  registrationDate: string; // registration_date
  startDate: string; // start_date
  status: StudentStatus; // 'active' | 'graduated' | 'inactive' | 'trial'
  notes?: string; // notes

  // Backward compatibility fields for legacy components
  name?: string;
  phone?: string;
  birthPlaceDate?: string;
  email?: string;
  enrolledCourse?: string;
  level?: LevelType | string;
  progress?: number;
  attendancePercentage?: number;
  totalClasses?: number;
  attendedClasses?: number;
  joinDate?: string;
  avatar?: string;
}

export type PaymentStatus = 'paid' | 'unpaid' | 'partial';
export type PaymentMethod = 'Cash' | 'Transfer' | 'QRIS' | string;

export interface PaymentRecord {
  id: string; // UUID
  studentId: string; // FK student_id
  studentName?: string; // Joined display name
  studentWhatsapp?: string; // Joined display whatsapp
  program?: StudentProgram;
  package?: StudentPackage;
  billingMonth: string; // billing_month YYYY-MM-DD
  amount: number; // amount
  dueDate: string; // due_date YYYY-MM-DD
  paidDate?: string; // paid_date YYYY-MM-DD
  paymentStatus: PaymentStatus; // 'paid' | 'unpaid' | 'partial'
  paymentMethod?: PaymentMethod; // 'Cash' | 'Transfer' | 'QRIS'
  notes?: string; // notes
  createdAt?: string;
}

export interface ClassSchedule {
  id: string;
  courseTitle: string;
  instructor: string;
  day: string; // e.g. 'Senin & Rabu'
  time: string; // e.g. '15:30 - 17:00 WIB'
  room: string; // e.g. 'Lab Bahasa 2 / Online Zoom'
  zoomLink?: string;
  topic: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  courseTitle: string;
  type: 'pdf' | 'audio' | 'video' | 'link';
  url: string;
  size?: string;
  uploadDate: string;
  description: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  courseTitle: string;
  testName: string;
  score: number;
  maxScore: number;
  grade: 'A' | 'B+' | 'B' | 'C' | 'D';
  feedback: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'academic' | 'event' | 'info';
  isImportant?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  registeredDate?: string;
}

export interface ContactSettings {
  locationName: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  openingHours: string;
  mapsEmbedUrl: string;
  mapsUrl: string;
}

export interface InstitutionInfo extends ContactSettings {
  name: string;
  tagline: string;
  accreditation: string;
  vision: string;
  mission: string[];
  statistics: {
    alumniCount: number;
    passRateTOEFL: number;
    certifiedInstructors: number;
    yearsExperience: number;
  };
}

export type ViewMode = 'landing' | 'test' | 'student-portal' | 'admin-portal';

import { supabase, isSupabaseConfigured } from './database.service';
import { Question, TestSubjectCategory } from '../types';

export function getSubjectDomain(q: any): TestSubjectCategory {
  if (q.subjectCategory === 'Komputer' || q.subject_category === 'Komputer') {
    return 'Komputer';
  }
  if (q.subjectCategory === 'B.inggris' || q.subject_category === 'B.inggris') {
    return 'B.inggris';
  }

  const cat = String(q.category || '').toLowerCase();
  const skill = String(q.skill || '').toLowerCase();

  if (
    cat.includes('computer') || cat.includes('komputer') || cat.includes('office') || cat.includes('digital') ||
    skill.includes('computer') || skill.includes('komputer') || skill.includes('office') || skill.includes('digital')
  ) {
    return 'Komputer';
  }

  return 'B.inggris';
}

export function mapQuestionFromDB(q: any): Question {
  let options: string[] | undefined = undefined;
  if (Array.isArray(q.options)) {
    options = q.options;
  } else if (typeof q.options === 'string' && q.options.trim()) {
    try {
      options = JSON.parse(q.options);
    } catch {
      options = undefined;
    }
  }

  const subjectCategory = getSubjectDomain(q);

  let resolvedCorrectAnswer: number | undefined = undefined;
  const raw = q.correct_answer ?? q.correctAnswer;
  if (raw !== undefined && raw !== null && raw !== '') {
    const rawAns = String(raw).trim();
    // 1. Match option text
    if (options && options.length > 0) {
      const idx = options.findIndex(opt => String(opt).trim().toLowerCase() === rawAns.toLowerCase());
      if (idx !== -1) {
        resolvedCorrectAnswer = idx;
      }
    }
    // 2. Match letter A/B/C/D
    if (resolvedCorrectAnswer === undefined && /^[A-Za-z]$/.test(rawAns)) {
      const letterIdx = rawAns.toUpperCase().charCodeAt(0) - 65;
      if (options && letterIdx >= 0 && letterIdx < options.length) {
        resolvedCorrectAnswer = letterIdx;
      }
    }
    // 3. Match numeric index 0/1/2/3
    if (resolvedCorrectAnswer === undefined && /^\d+$/.test(rawAns)) {
      const numIdx = parseInt(rawAns, 10);
      if (options && numIdx >= 0 && numIdx < options.length) {
        resolvedCorrectAnswer = numIdx;
      } else if (!options) {
        resolvedCorrectAnswer = numIdx;
      }
    }
  }

  return {
    id: String(q.id ?? ''),
    category: String(q.category || 'grammar'),
    subjectCategory,
    questionText: String(q.question || q.question_text || q.questionText || ''),
    passage: q.passage ? String(q.passage) : undefined,
    audioUrl: (q.audio_url || q.audioUrl) ? String(q.audio_url || q.audioUrl) : undefined,
    options,
    correctAnswer: resolvedCorrectAnswer,
    explanation: q.explanation ? String(q.explanation) : undefined,
    isActive: q.is_active !== undefined && q.is_active !== null
      ? Boolean(q.is_active)
      : (q.isActive !== undefined && q.isActive !== null ? Boolean(q.isActive) : true)
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function shuffleQuestionOptions<T extends { options?: string[]; correctAnswer?: number }>(q: T): T {
  if (!q.options || q.options.length <= 1 || q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
    return q;
  }

  const cleanedOptions = q.options.map(opt => String(opt).replace(/^[A-Da-d][\.\)]\s*/, '').trim());

  const items = cleanedOptions.map((optText, idx) => ({
    text: optText,
    isCorrect: idx === q.correctAnswer
  }));

  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const newOptions = shuffled.map(item => item.text);
  const newCorrectAnswer = shuffled.findIndex(item => item.isCorrect);

  return {
    ...q,
    options: newOptions,
    correctAnswer: newCorrectAnswer !== -1 ? newCorrectAnswer : q.correctAnswer
  };
}

export function deduplicateQuestions(questions: Question[]): Question[] {
  const seenIds = new Set<string>();
  const seenTexts = new Set<string>();
  const result: Question[] = [];

  questions.forEach((q, idx) => {
    if (!q) return;
    const normText = (q.questionText || '').trim().toLowerCase();
    
    // Skip duplicate question text
    if (normText && seenTexts.has(normText)) {
      return;
    }

    // Ensure valid unique ID
    let validId = q.id && q.id.trim() !== '' ? q.id.trim() : `q-${idx}-${Math.random().toString(36).substring(2, 7)}`;
    if (seenIds.has(validId)) {
      validId = `q-${idx}-${Math.random().toString(36).substring(2, 7)}`;
    }

    seenIds.add(validId);
    if (normText) seenTexts.add(normText);

    result.push({
      ...q,
      id: validId
    });
  });

  return result;
}

export async function getPlacementQuestions(
  limit: number = 30,
  subjectCategory: 'B.inggris' | 'Komputer' | 'all' = 'all'
): Promise<Question[]> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Koneksi database Supabase tidak tersedia.');
  }

  // Fetch all active questions from Supabase bank
  const { data, error } = await supabase
    .from('placement_questions')
    .select('*')
    .eq('is_active', true);

  if (error) {
    // Fallback if is_active column filter fails due to schema difference
    if (error.code === 'PGRST204' || error.message?.includes('is_active')) {
      const fallback = await supabase.from('placement_questions').select('*');
      if (fallback.error) {
        throw new Error(`Gagal mengambil data dari Supabase: ${fallback.error.message}`);
      }
      let allQuestions = (fallback.data || [])
        .map(mapQuestionFromDB)
        .filter(q => q.isActive !== false);

      if (subjectCategory !== 'all') {
        allQuestions = allQuestions.filter(q => q.subjectCategory === subjectCategory);
      }

      const uniqueQuestions = deduplicateQuestions(allQuestions);
      const selected = shuffleArray(uniqueQuestions).slice(0, limit);
      return selected.map(shuffleQuestionOptions);
    }
    throw new Error(`Gagal mengambil data dari Supabase: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  let questions = data.map(mapQuestionFromDB);
  if (subjectCategory !== 'all') {
    questions = questions.filter(q => q.subjectCategory === subjectCategory);
  }

  // Deduplicate and Shuffle questions order and options order for balanced random options A, B, C, D
  const uniqueQuestions = deduplicateQuestions(questions);
  const selected = shuffleArray(uniqueQuestions).slice(0, limit);
  return selected.map(shuffleQuestionOptions);
}

export function mapQuestionToDB(q: Partial<Question>): Record<string, any> {
  const payload: Record<string, any> = {};
  if (q.category !== undefined) payload.category = q.category;
  if (q.subjectCategory !== undefined) payload.skill = q.subjectCategory;
  if (q.questionText !== undefined) {
    payload.question = q.questionText;
  }
  if (q.options !== undefined) payload.options = q.options;
  if (q.correctAnswer !== undefined) payload.correct_answer = q.correctAnswer;
  if (q.explanation !== undefined) payload.explanation = q.explanation || null;
  if (q.isActive !== undefined) payload.is_active = q.isActive;
  return payload;
}

export async function getAllPlacementQuestions(): Promise<Question[]> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Koneksi database Supabase tidak tersedia.');
  }

  const { data, error } = await supabase
    .from('placement_questions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil data dari Supabase: ${error.message}`);
  }

  return (data || []).map(mapQuestionFromDB);
}

export async function createPlacementQuestion(questionData: Omit<Question, 'id'>): Promise<Question> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Koneksi database Supabase tidak tersedia.');
  }

  const dbPayload = mapQuestionToDB(questionData);
  const { data, error } = await supabase
    .from('placement_questions')
    .insert([dbPayload])
    .select('*')
    .single();

  if (error) {
    const fallback = await supabase.from('placement_questions').insert([dbPayload]);
    if (fallback.error) {
      throw new Error(`Gagal menambah soal ke Supabase: ${fallback.error.message}`);
    }
    return mapQuestionFromDB({ ...dbPayload, id: String(Date.now()) });
  }

  return mapQuestionFromDB(data);
}

export async function updatePlacementQuestion(id: string, questionData: Partial<Question>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Koneksi database Supabase tidak tersedia.');
  }

  const dbPayload = mapQuestionToDB(questionData);
  const { error } = await supabase
    .from('placement_questions')
    .update(dbPayload)
    .eq('id', id);

  if (error) {
    throw new Error(`Gagal memperbarui soal di Supabase: ${error.message}`);
  }
}

export async function deletePlacementQuestion(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Koneksi database Supabase tidak tersedia.');
  }

  const { error } = await supabase
    .from('placement_questions')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Gagal menghapus soal dari Supabase: ${error.message}`);
  }
}

export async function toggleQuestionActive(id: string, isActive: boolean): Promise<void> {
  return updatePlacementQuestion(id, { isActive });
}

export const SAMPLE_PLACEMENT_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    category: 'grammar',
    questionText: 'She ___ to the office every morning.',
    options: ['go', 'goes', 'went', 'going'],
    correctAnswer: 1, // B
    explanation: 'Subjek third-person singular "She" pada Present Simple Tense menggunakan kata kerja bersufiks -es (goes).',
    isActive: true
  },
  {
    category: 'grammar',
    questionText: 'If I ___ more time, I would learn a new language.',
    options: ['have', 'will have', 'had', 'having'],
    correctAnswer: 2, // C
    explanation: 'Kalimat pengandaian Tipe 2 (Second Conditional) menggunakan kata kerja Simple Past (had) pada klausa pengandaian (if-clause).',
    isActive: true
  },
  {
    category: 'grammar',
    questionText: 'The monthly financial report ___ by the manager yesterday afternoon.',
    options: ['reviewed', 'is reviewed', 'has reviewed', 'was reviewed'],
    correctAnswer: 3, // D
    explanation: 'Kalimat pasif waktu lampau (Simple Past Passive) menggunakan rumus was/were + V3 (was reviewed).',
    isActive: true
  },
  {
    category: 'vocabulary',
    questionText: 'The CEO gave a very ___ presentation that motivated all team members.',
    options: ['inspiring', 'boring', 'confusing', 'careless'],
    correctAnswer: 0, // A
    explanation: 'Kata sifat "inspiring" berarti menginspirasi atau membangkitkan semangat.',
    isActive: true
  },
  {
    category: 'vocabulary',
    questionText: 'Please ___ your official registration form before the announced deadline.',
    options: ['delete', 'ignore', 'submit', 'postpone'],
    correctAnswer: 2, // C
    explanation: 'Kata "submit" berarti menyerahkan atau mengumpulkan dokumen.',
    isActive: true
  },
  {
    category: 'reading',
    passage: 'Politek IBC Jatibarang provides intensive practical vocational English courses in Indramayu to prepare students for global professional careers.',
    questionText: 'What kind of courses does Politek IBC offer?',
    options: ['Academic theory only', 'Primary school education', 'Sports coaching', 'Practical vocational English courses'],
    correctAnswer: 3, // D
    explanation: 'Berdasarkan teks bacaan, Politek IBC menyediakan "practical vocational English courses".',
    isActive: true
  },
  {
    category: 'reading',
    passage: 'Politek IBC Jatibarang provides intensive practical vocational English courses in Indramayu to prepare students for global professional careers.',
    questionText: 'What is the primary objective of the program?',
    options: ['To prepare students for global professional careers', 'To sell language textbooks', 'To organize music festivals', 'To conduct sports leagues'],
    correctAnswer: 0, // A
    explanation: 'Teks menyatakan bahwa tujuan utamanya adalah "to prepare students for global professional careers".',
    isActive: true
  },
  {
    category: 'listening',
    questionText: 'Listen to the greeting and select the most appropriate response to "How do you do?".',
    options: ['I am fine', 'How do you do?', 'Yes, I do', 'Thank you very much'],
    correctAnswer: 1, // B
    explanation: 'Sapaan formal "How do you do?" dibalas secara tradisional dengan ungkapan yang sama "How do you do?".',
    isActive: true
  },
  {
    category: 'essay',
    questionText: 'Write a short essay (50-100 words) describing your personal motivation for joining Politek IBC English program and your future career goals.',
    explanation: 'Soal esai ini digunakan oleh AI Diagnostic Engine untuk mengevaluasi struktur kalimat, kekayaan kosa kata, serta pemikiran analitis calon peserta.',
    isActive: true
  }
];

export async function seedDefaultQuestions(): Promise<Question[]> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Koneksi database Supabase tidak tersedia.');
  }

  const payloads = SAMPLE_PLACEMENT_QUESTIONS.map(mapQuestionToDB);
  const { error } = await supabase.from('placement_questions').insert(payloads);
  if (error) {
    throw new Error(`Gagal melakukan seeding bank soal: ${error.message}`);
  }

  return getAllPlacementQuestions();
}

export const PlacementService = {
  getPlacementQuestions,
  getAllPlacementQuestions,
  createPlacementQuestion,
  updatePlacementQuestion,
  deletePlacementQuestion,
  toggleQuestionActive,
  seedDefaultQuestions
};

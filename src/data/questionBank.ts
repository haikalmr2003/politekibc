import { PlacementQuestion } from '../types';

export const INITIAL_QUESTION_BANK: PlacementQuestion[] = [
  // 1. GRAMMAR (6 questions)
  {
    id: "g-1",
    category: "grammar",
    questionText: "She ________ at Politek IBC since last year.",
    options: ["is studying", "has been studying", "studied", "was studied"],
    correctAnswer: 1, // B
    explanation: "Gunakan Present Perfect Continuous (has been studying) untuk aksi yang dimulai di masa lalu dan masih berlangsung."
  },
  {
    id: "g-2",
    category: "grammar",
    questionText: "If I ________ enough time, I would join the intensive TOEFL prep class.",
    options: ["have", "would have", "had", "had had"],
    correctAnswer: 2, // C
    explanation: "Conditional Sentence Type 2 menggunakan Simple Past (had) di 'if-clause'."
  },
  {
    id: "g-3",
    category: "grammar",
    questionText: "The new campus building ________ by the end of next month.",
    options: ["will complete", "is completing", "has completed", "will be completed"],
    correctAnswer: 3, // D
    explanation: "Passive Future Tense: 'will be + V3' (will be completed)."
  },
  {
    id: "g-4",
    category: "grammar",
    questionText: "Neither the instructor nor the students ________ satisfied with the old schedule.",
    options: ["were", "was", "is", "are being"],
    correctAnswer: 0, // A
    explanation: "Subjek paling dekat dengan kata kerja (students) bersifat jamak, sehingga menggunakan 'were'."
  },
  {
    id: "g-5",
    category: "grammar",
    questionText: "Hardly ________ the presentation when the power went out.",
    options: ["she had started", "she started", "had she started", "did she started"],
    correctAnswer: 2, // C
    explanation: "Inversi setelah adverbial negatif 'Hardly': 'Hardly had + Subject + V3'."
  },
  {
    id: "g-6",
    category: "grammar",
    questionText: "I look forward to ________ you at the Politek IBC graduation ceremony.",
    options: ["meet", "met", "be meeting", "meeting"],
    correctAnswer: 3, // D
    explanation: "Frasa 'look forward to' selalu diikuti gerund (V-ing)."
  },

  // 2. VOCABULARY (5 questions)
  {
    id: "v-1",
    category: "vocabulary",
    questionText: "The lecturer gave a very ________ explanation, making complex grammar easy to understand.",
    options: ["lucid", "obscure", "vague", "monotonous"],
    correctAnswer: 0, // A
    explanation: "'Lucid' berarti jelas dan mudah dipahami."
  },
  {
    id: "v-2",
    category: "vocabulary",
    questionText: "To excel in international business communications, one must be ________ in English.",
    options: ["hestitant", "reluctant", "fluent", "obsolete"],
    correctAnswer: 2, // C
    explanation: "'Fluent' berarti lancar dan fasih."
  },
  {
    id: "v-3",
    category: "vocabulary",
    questionText: "The company plans to ________ its global operations by launching courses in Asia.",
    options: ["curtail", "relinquish", "dismantle", "expand"],
    correctAnswer: 3, // D
    explanation: "'Expand' berarti memperluas jangkauan."
  },
  {
    id: "v-4",
    category: "vocabulary",
    questionText: "His TOEFL score showed a ________ improvement after two months of intensive study.",
    options: ["negligible", "remarkable", "detrimental", "superficial"],
    correctAnswer: 1, // B
    explanation: "'Remarkable' berarti sangat signifikan/luar biasa."
  },
  {
    id: "v-5",
    category: "vocabulary",
    questionText: "Effective public speaking requires both clear articulation and confident ________.",
    options: ["stagnation", "posture", "hesitation", "omission"],
    correctAnswer: 1, // B
    explanation: "'Posture' merujuk pada sikap dan gestur tubuh yang percaya diri."
  },

  // 3. READING (3 questions based on 1 passage)
  {
    id: "r-1",
    category: "reading",
    passage: "Global communication has undergone a monumental shift over the past decade. English has firmly established itself as the lingua franca of global commerce, academic research, and international technology standards. Professionals who master professional communication in English gain access to broader career networks and higher scholarship prospects worldwide.",
    questionText: "What is the main topic of the passage?",
    options: [
      "The history of global communication technologies",
      "The essential role of English in global commerce and academics",
      "The difficulties of studying abroad without scholarship",
      "How to pass international technology certifications"
    ],
    correctAnswer: 1, // B
    explanation: "Paragraf berfokus pada peran penting Bahasa Inggris sebagai bahasa internasional di bidang perdagangan dan akademis."
  },
  {
    id: "r-2",
    category: "reading",
    passage: "Global communication has undergone a monumental shift over the past decade. English has firmly established itself as the lingua franca of global commerce, academic research, and international technology standards. Professionals who master professional communication in English gain access to broader career networks and higher scholarship prospects worldwide.",
    questionText: "The word 'monumental' in the passage is closest in meaning to:",
    options: ["insignificant", "historical", "enormous and important", "gradual"],
    correctAnswer: 2, // C
    explanation: "'Monumental' bermakna perubahan yang sangat besar dan penting."
  },
  {
    id: "r-3",
    category: "reading",
    passage: "Global communication has undergone a monumental shift over the past decade. English has firmly established itself as the lingua franca of global commerce, academic research, and international technology standards. Professionals who master professional communication in English gain access to broader career networks and higher scholarship prospects worldwide.",
    questionText: "According to the passage, what benefit do professionals gain from mastering English?",
    options: [
      "Immediate promotion without interviews",
      "Free travel tickets to English-speaking countries",
      "Automatic exemption from college exams",
      "Wider career networks and better scholarship prospects"
    ],
    correctAnswer: 3, // D
    explanation: "Teks menyebutkan: 'access to broader career networks and higher scholarship prospects worldwide'."
  },

  // 4. LISTENING (2 questions based on simulated dialogue)
  {
    id: "l-1",
    category: "listening",
    passage: "[Audio Simulation - Dialogue between Student and Admissions Officer]\nStudent: 'Hi, I would like to inquire about the TOEFL Preparation Booster schedule.'\nOfficer: 'Certainly! We have weekday evening classes from 6:30 PM to 8:30 PM, and weekend morning classes starting at 9:00 AM.'\nStudent: 'Weekend mornings sound perfect for me because of my office hours.'",
    questionText: "Which class schedule does the student prefer?",
    options: [
      "Weekday morning classes",
      "Weekday evening classes",
      "Weekend morning classes",
      "Sunday afternoon classes"
    ],
    correctAnswer: 2, // C
    explanation: "Siswa secara jelas memilih: 'Weekend mornings sound perfect for me'."
  },
  {
    id: "l-2",
    category: "listening",
    passage: "[Audio Simulation - Dialogue between Student and Admissions Officer]\nStudent: 'Hi, I would like to inquire about the TOEFL Preparation Booster schedule.'\nOfficer: 'Certainly! We have weekday evening classes from 6:30 PM to 8:30 PM, and weekend morning classes starting at 9:00 AM.'\nStudent: 'Weekend mornings sound perfect for me because of my office hours.'",
    questionText: "Why does the student choose that particular schedule?",
    options: [
      "Because the fee is cheaper on weekends",
      "Because the campus is closed on weekdays",
      "Because of public holiday discounts",
      "Because of office hours during the week"
    ],
    correctAnswer: 3, // D
    explanation: "Siswa menyatakan memilih weekend karena jam kerja kantornya ('because of my office hours')."
  },

  // 5. WRITING / ESSAY (1 question)
  {
    id: "w-1",
    category: "essay",
    questionText: "Writing Task: Please write a brief paragraph (3-5 sentences) introducing yourself, your main motivation for learning English at Politek IBC, and your career or academic target for the next 2 years.",
    explanation: "Writing task ini akan dievaluasi oleh Gemini AI & instruktur untuk menilai struktur kalimat, kosakata, dan koherensi tulisan."
  }
];

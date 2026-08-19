import { PlacementQuestion, TestSubjectCategory, LevelType, AIAnalysisResult } from '../../../types';

export interface ScoreBreakdown {
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
  percentage: number;
  categoryBreakdown: Record<string, { correct: number; total: number }>;
}

export function calculateSectionScores(
  questions: PlacementQuestion[],
  answersMap: Record<string, number>
): ScoreBreakdown {
  let grammar = 0, maxGrammar = 0;
  let vocabulary = 0, maxVocabulary = 0;
  let reading = 0, maxReading = 0;
  let listening = 0, maxListening = 0;
  let mcqTotal = 0, maxTotal = 0;

  const categoryBreakdown: Record<string, { correct: number; total: number }> = {};

  questions.forEach(q => {
    if (q.category !== 'essay') {
      maxTotal++;

      const catName = String(q.category || 'Umum');
      if (!categoryBreakdown[catName]) {
        categoryBreakdown[catName] = { correct: 0, total: 0 };
      }
      categoryBreakdown[catName].total++;

      const lowerCat = catName.toLowerCase();
      if (lowerCat.includes('grammar')) maxGrammar++;
      else if (lowerCat.includes('vocab')) maxVocabulary++;
      else if (lowerCat.includes('read')) maxReading++;
      else if (lowerCat.includes('listen')) maxListening++;

      const userAns = answersMap[q.id];
      const isCorrect = userAns !== undefined && q.correctAnswer !== undefined && userAns === q.correctAnswer;
      
      if (isCorrect) {
        mcqTotal++;
        categoryBreakdown[catName].correct++;

        if (lowerCat.includes('grammar')) grammar++;
        else if (lowerCat.includes('vocab')) vocabulary++;
        else if (lowerCat.includes('read')) reading++;
        else if (lowerCat.includes('listen')) listening++;
      }
    }
  });

  const percentage = Math.round((mcqTotal / (maxTotal || 1)) * 100);

  return {
    grammar,
    maxGrammar,
    vocabulary,
    maxVocabulary,
    reading,
    maxReading,
    listening,
    maxListening,
    total: mcqTotal,
    maxTotal,
    percentage,
    categoryBreakdown
  };
}

export function determineCEFRMapping(
  percentage: number,
  subjectCategory: TestSubjectCategory | string = 'B.inggris'
): {
  cefrLevel: string;
  recommendedLevel: LevelType | string;
  recommendedCourse: string;
  estimatedDuration: string;
} {
  const isComputer = subjectCategory === 'Komputer';

  if (isComputer) {
    if (percentage >= 85) {
      return {
        cefrLevel: 'Advanced',
        recommendedLevel: 'Komputer - Career Ready',
        recommendedCourse: 'Komputer - Career Ready & Digital Mastery',
        estimatedDuration: '4 - 6 Minggu (Akselerasi)'
      };
    } else if (percentage >= 70) {
      return {
        cefrLevel: 'Upper-Inter',
        recommendedLevel: 'Komputer - Digital Productivity',
        recommendedCourse: 'Komputer - Digital Productivity & Office Advanced',
        estimatedDuration: '6 - 8 Minggu'
      };
    } else if (percentage >= 50) {
      return {
        cefrLevel: 'Intermediate',
        recommendedLevel: 'Komputer - Office Productivity',
        recommendedCourse: 'Komputer - Office Productivity (Word, Excel, PPT)',
        estimatedDuration: '8 - 10 Minggu'
      };
    } else if (percentage >= 35) {
      return {
        cefrLevel: 'Elementary',
        recommendedLevel: 'Komputer - Computer Basic',
        recommendedCourse: 'Komputer - Computer Basic & Pengenalan IT',
        estimatedDuration: '10 - 12 Minggu'
      };
    } else {
      return {
        cefrLevel: 'Beginner',
        recommendedLevel: 'Komputer - Computer Basic',
        recommendedCourse: 'Komputer - Computer Basic (Fondasi Dasar Operasi Komputer)',
        estimatedDuration: '12 Minggu'
      };
    }
  }

  // Bahasa Inggris Default Mapping
  if (percentage >= 85) {
    return {
      cefrLevel: 'C1',
      recommendedLevel: 'C1 Advanced',
      recommendedCourse: 'Bahasa Inggris - C1 Advanced / TOEFL & IELTS Mastery',
      estimatedDuration: '6 - 8 Minggu (Super Intensive)'
    };
  } else if (percentage >= 70) {
    return {
      cefrLevel: 'B2',
      recommendedLevel: 'B2 Upper-Intermediate',
      recommendedCourse: 'Bahasa Inggris - Intermediate (B1-B2)',
      estimatedDuration: '8 - 10 Minggu'
    };
  } else if (percentage >= 50) {
    return {
      cefrLevel: 'B1',
      recommendedLevel: 'B1 Intermediate',
      recommendedCourse: 'Bahasa Inggris - Elementary (A2-B1)',
      estimatedDuration: '10 - 12 Minggu'
    };
  } else if (percentage >= 35) {
    return {
      cefrLevel: 'A2',
      recommendedLevel: 'A2 Elementary',
      recommendedCourse: 'Bahasa Inggris - Beginner (A1)',
      estimatedDuration: '12 - 14 Minggu'
    };
  } else {
    return {
      cefrLevel: 'A1',
      recommendedLevel: 'A1 Beginner',
      recommendedCourse: 'Bahasa Inggris - Starter (Pre-A1)',
      estimatedDuration: '14 - 16 Minggu'
    };
  }
}

export function generateDiagnosticAIReport(
  studentName: string,
  scores: ScoreBreakdown,
  targetProgram: string,
  essayAnswer?: string,
  subjectCategory: TestSubjectCategory | string = 'B.inggris'
): AIAnalysisResult {
  const { percentage, total, maxTotal, categoryBreakdown } = scores;
  const isComputer = subjectCategory === 'Komputer';

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (isComputer) {
    if (percentage >= 70) {
      strengths.push("Pemahaman operasional komputer & fungsi perangkat lunak sangat baik.");
      strengths.push("Mampu mengoperasikan aplikasi produktivitas kantor secara efektif.");
    } else if (percentage >= 50) {
      strengths.push("Sudah memiliki dasar pengoperasian komputer & navigasi sistem.");
      weaknesses.push("Perlu penguatan formula Excel, otomatisasi dokumen, dan manajemen file.");
    } else {
      strengths.push("Semangat belajar pengenalan teknologi komputer & aplikasi digital.");
      weaknesses.push("Perlu fondasi dasar pengoperasian sistem komputer, ketik cepat, & Office.");
    }

    let analysis = `Peserta atas nama ${studentName} telah menyelesaikan Placement Test Komputer dengan perolehan skor ${percentage}% (${total}/${maxTotal}). `;
    if (percentage >= 75) {
      analysis += `Tingkat pemahaman teknologi komputer & aplikasi perkantoran tergolong mahir. Sangat direkomendasikan mengambil program akselerasi ${targetProgram || 'Komputer - Digital Productivity'}.`;
    } else if (percentage >= 50) {
      analysis += `Tingkat pemahaman komputer sudah berada di level menengah. Fokus utama pengembangannya adalah penguasaan formula spreadsheet (Excel) & efisiensi kerja digital.`;
    } else {
      analysis += `Tingkat pemahaman berada di level dasar/pemula. Direkomendasikan memulai dari program Komputer Basic untuk membangun fondasi keterampilan praktis perkantoran.`;
    }

    return {
      analysis,
      strengths: strengths.length > 0 ? strengths : ["Pemahaman operasional dasar komputer"],
      weaknesses: weaknesses.length > 0 ? weaknesses : ["Praktik efisiensi aplikasi perkantoran"],
      recommendation: `Fokus pada latihan praktik intensif program ${targetProgram || 'Komputer'} di Lab Komputer Politek IBC.`,
      suggestedFocus: "Praktik Microsoft Office (Word, Excel, PPT), navigasi sistem operasi, dan internet produktif."
    };
  }

  // Bahasa Inggris Analysis
  const { grammar, maxGrammar, vocabulary, maxVocabulary, reading, maxReading, listening, maxListening } = scores;

  if (grammar / (maxGrammar || 1) >= 0.7) {
    strengths.push("Pemahaman struktur tata bahasa & tenses yang solid.");
  } else if (maxGrammar > 0) {
    weaknesses.push("Perlu penguatan pola tenses, passives, dan klausa majemuk.");
  }

  if (vocabulary / (maxVocabulary || 1) >= 0.7) {
    strengths.push("Penguasaan kosakata akademis & profesional yang kaya.");
  } else if (maxVocabulary > 0) {
    weaknesses.push("Perkaya perbendaharaan kata (vocabulary) akademis & idiom bisnis.");
  }

  if (reading / (maxReading || 1) >= 0.7) {
    strengths.push("Kemampuan analisa teks & pemahaman bacaan cepat.");
  } else if (maxReading > 0) {
    weaknesses.push("Tingkatkan latihan reading comprehension & penemuan ide utama.");
  }

  if (listening / (maxListening || 1) >= 0.7) {
    strengths.push("Daya tangkap pendengaran (listening) terhadap aksen bahasa Inggris cukup tajam.");
  } else if (maxListening > 0) {
    weaknesses.push("Perbanyak mendengar dialog asli (native speaker dialogue & audio).");
  }

  if (essayAnswer && essayAnswer.trim().length > 30) {
    strengths.push("Memiliki inisiatif ekspresi tulisan Bahasa Inggris mandiri.");
  }

  // Dynamic check for custom categories in English if any
  Object.entries(categoryBreakdown).forEach(([cat, s]) => {
    if (s.total > 0) {
      const catRatio = s.correct / s.total;
      if (catRatio >= 0.7 && !strengths.some(st => st.includes(cat))) {
        strengths.push(`Penguasaan pada kategori ${cat} mencapai ${Math.round(catRatio * 100)}%.`);
      }
    }
  });

  let analysis = `Peserta atas nama ${studentName} berhasil mengumpulkan total skor ${percentage}% (${scores.total}/${scores.maxTotal}). `;
  if (percentage >= 75) {
    analysis += `Kinerja tes menunjukkan penguasaan Bahasa Inggris di tingkat atas (Upper-Intermediate/Advanced). Sangat direkomendasikan mengambil kelas akselerasi sertifikasi ${targetProgram || 'TOEFL/IELTS'}.`;
  } else if (percentage >= 50) {
    analysis += `Kinerja menunjukkan pemahaman Bahasa Inggris yang stabil di tingkat menengah (Intermediate). Fokus utama peningkatannya adalah pengayaan ekspresi otomatis dan tata bahasa tingkat lanjut.`;
  } else {
    analysis += `Kinerja menunjukkan dasar Bahasa Inggris yang berkembang (Foundation/Elementary). Direkomendasikan memulai dengan program kelas reguler terstruktur untuk memperkuat dasar tata bahasa & percakapan sehari-hari.`;
  }

  return {
    analysis,
    strengths: strengths.length > 0 ? strengths : ["Semangat belajar yang tinggi", "Responsif pada instruksi soal"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Konsistensi latihan mingguan"],
    recommendation: `Fokus pada latihan intensif modul ${targetProgram || 'General English'} selama 2-3 bulan.`,
    suggestedFocus: "Grammar accuracy, daily speaking practice, and test strategy simulation."
  };
}

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client lazily/safely
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    institution: "Politek IBC",
    timestamp: new Date().toISOString(),
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// AI Evaluation endpoint for Placement Test diagnostic & personalized feedback
app.post("/api/ai/evaluate-placement", async (req, res) => {
  try {
    const { studentName, subjectCategory, scores, totalQuestions, essayText } = req.body;
    const isComputer = subjectCategory === 'Komputer';

    const aiClient = getGenAI();
    if (!aiClient) {
      return res.json({
        analysis: `Hasil Placement Test ${isComputer ? 'Komputer' : 'Bahasa Inggris'} Politek IBC untuk ${studentName || "Siswa"}: Skor Total ${scores.total}/${totalQuestions}. Berdasarkan evaluasi, Anda direkomendasikan masuk tingkat ${scores.recommendedLevel}.`,
        strengths: isComputer 
          ? ["Pemahaman Dasar Perangkat Komputer", "Pengoperasian Aplikasi Perkantoran"]
          : ["Penguasaan Tata Bahasa (Grammar)", "Kosakata Kunci (Vocabulary)"],
        weaknesses: isComputer
          ? ["Formula & Otomatisasi Spreadsheet (Excel)", "Efisiensi Manajemen File"]
          : ["Kelancaran Membaca Teks Kompleks", "Struktur Penulisan Kalimat"],
        recommendation: `Program ${scores.recommendedCourse} di Politek IBC disarankan untuk mempercepat peningkatan keterampilan ${isComputer ? 'Komputer & IT' : 'Bahasa Inggris'} Anda.`,
        suggestedFocus: isComputer
          ? "Praktik langsung MS Office dan efisiensi kerja komputer perkantoran."
          : "Latihan percakapan intensif dan pemahaman tata bahasa tingkat lanjut.",
      });
    }

    const assessorRole = isComputer 
      ? "Academic Director & Expert Computer / IT Instructor di Politek IBC"
      : "Academic Director & Expert English Assessor di Politek IBC";

    const prompt = `Anda adalah ${assessorRole}.
Berikan analisis dan umpan balik diagnostik profesional untuk hasil Placement Test (${isComputer ? 'Komputer' : 'Bahasa Inggris'}) siswa berikut:

Nama Siswa: ${studentName || "Calon Siswa"}
Kategori Tes: ${isComputer ? 'Komputer' : 'Bahasa Inggris'}
Skor Total: ${scores.total} dari ${totalQuestions} soal (${Math.round((scores.total / (totalQuestions || 1)) * 100)}%)
Tingkat yang Direkomendasikan: ${scores.recommendedLevel}
Kursus yang Direkomendasikan: ${scores.recommendedCourse}
Teks Catatan / Jawaban Tambahan Siswa: "${essayText || "Tidak ada"}"

Sajikan tanggapan dalam bentuk JSON dengan format persis berikut (dalam Bahasa Indonesia yang sopan, memotivasi, dan profesional):
{
  "analysis": "Penjelasan ringkas hasil kemampuan siswa...",
  "strengths": ["Poin kelebihan 1", "Poin kelebihan 2"],
  "weaknesses": ["Area yang perlu ditingkatkan 1", "Area yang perlu ditingkatkan 2"],
  "recommendation": "Rekomendasi belajar spesifik di Politek IBC...",
  "suggestedFocus": "Fokus materi utama untuk minggu pertama..."
}`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const resultJson = JSON.parse(responseText);

    res.json(resultJson);
  } catch (error: any) {
    console.error("AI Evaluation error:", error);
    res.status(500).json({
      error: "Gagal memproses evaluasi AI",
      details: error.message,
    });
  }
});

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Politek IBC Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

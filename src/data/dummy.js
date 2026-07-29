// Dummy data used across the site. Centralizing makes it easy to replace with real API later.

export const stats = [
  { id: 1, label: "Total Alumni", value: 1284, icon: "FaGraduationCap" },
  { id: 2, label: "Siswa Aktif", value: 98, icon: "FaUserGraduate" },
  { id: 3, label: "Lulus", value: 356, icon: "FaCertificate" },
  { id: 4, label: "Cuti", value: 14, icon: "FaCalendarAlt" }
];

export const programs = [
  { id: 1, title: "Computer Basic", icon: "FaLaptop" },
  { id: 2, title: "Microsoft Office", icon: "FaFileWord" },
  { id: 3, title: "Canva Design", icon: "FaPalette" },
  { id: 4, title: "AI Productivity", icon: "FaRobot" },
  { id: 5, title: "English Course", icon: "FaLanguage" },
  { id: 6, title: "Siap Kerja Digital", icon: "FaBriefcase" }
];

export const whyChoose = [
  "Berdiri sejak 1985",
  "Instruktur Berpengalaman",
  "Placement Test Gratis",
  "Sertifikat",
  "Offline & Online",
  "Pendampingan Karier"
];

// generate 40 dummy MCQ questions programmatically (for placement test)
export const generateQuestions = (n = 40) => {
  const questions = [];
  for (let i = 1; i <= n; i++) {
    questions.push({
      id: i,
      text: `Soal ${i}: Ini adalah contoh soal pilihan ganda nomor ${i}. Pilih jawaban yang paling tepat.`,
      options: [
        "Pilihan A",
        "Pilihan B",
        "Pilihan C",
        "Pilihan D"
      ],
      // set correct randomly for demo purposes
      correct: Math.floor(Math.random() * 4)
    });
  }
  return questions;
};

// sample testimonials
export const testimonials = [
  {
    id: 1,
    name: "Dina Putri",
    avatar: "/src/assets/avatar1.svg",
    rating: 5,
    comment: "Kursus yang sangat membantu! Instruktur sabar dan materi relevan."
  },
  {
    id: 2,
    name: "Rian Saputra",
    avatar: "/src/assets/avatar2.svg",
    rating: 5,
    comment: "Placement test akurat dan membimbing saya ke level selanjutnya."
  },
  {
    id: 3,
    name: "Siti Aisyah",
    avatar: "/src/assets/avatar3.svg",
    rating: 4,
    comment: "Fasilitas offline & online memudahkan untuk belajar."
  }
];

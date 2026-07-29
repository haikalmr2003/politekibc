import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { generateQuestions } from "../data/dummy";

/**
 * Placement Test page with 3 steps:
 * 1. Personal data form
 * 2. Multiple choice (40 questions)
 * 3. Result and save (local)
 *
 * No backend — results are stored in local state (and downloadable as JSON).
 */

const allQuestions = generateQuestions(40);

function Step1({ form, setForm, onNext }) {
  return (
    <div className="max-w-3xl mx-auto p-6 card">
      <h3 className="text-xl font-semibold mb-4">Step 1 — Isi Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nama" className="p-3 border rounded" />
        <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="WhatsApp" className="p-3 border rounded" />
        <input value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="Umur" className="p-3 border rounded" />
        <input value={form.education} onChange={e => setForm({...form, education: e.target.value})} placeholder="Pendidikan" className="p-3 border rounded" />
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={onNext} className="px-4 py-2 bg-ibc-red text-white rounded-md">Lanjut</button>
      </div>
    </div>
  );
}

function Step2({ answers, setAnswers, onPrev, onNext }) {
  const [index, setIndex] = useState(0);
  const q = allQuestions[index];

  const setAnswer = (choice) => {
    setAnswers(prev => ({...prev, [q.id]: choice}));
  };

  const answered = answers[q.id] !== undefined;

  return (
    <div className="max-w-4xl mx-auto p-6 card">
      <h3 className="text-xl font-semibold mb-4">Step 2 — Soal Pilihan Ganda</h3>

      <div className="mb-4">
        <div className="text-sm text-gray-600">Progres: {Object.keys(answers).length} / {allQuestions.length}</div>
        <div className="w-full bg-gray-200 h-2 rounded mt-2">
          <div style={{width: `${(Object.keys(answers).length / allQuestions.length) * 100}%`}} className="h-2 bg-ibc-red rounded"></div>
        </div>
      </div>

      <div className="p-4 border rounded">
        <div className="font-semibold mb-3">Soal {q.id}</div>
        <div className="mb-4 text-gray-700">{q.text}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswer(i)}
              className={`p-3 text-left border rounded ${answers[q.id] === i ? "bg-ibc-red text-white" : "bg-white"}`}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="space-x-2">
          <button disabled={index === 0} onClick={() => setIndex(i => Math.max(0, i - 1))} className="px-3 py-2 border rounded">Previous</button>
          <button disabled={index === allQuestions.length-1} onClick={() => setIndex(i => Math.min(allQuestions.length-1, i + 1))} className="px-3 py-2 border rounded">Next</button>
        </div>

        <div className="space-x-2">
          <button onClick={onPrev} className="px-4 py-2 border rounded">Kembali</button>
          <button onClick={onNext} className="px-4 py-2 bg-ibc-red text-white rounded">Selesai</button>
        </div>
      </div>
    </div>
  );
}

function Step3({ form, answers, onSave, onRestart }) {
  const total = allQuestions.length;
  const correct = allQuestions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0);
  const score = Math.round((correct / total) * 100);
  let level = "Beginner";
  if (score >= 80) level = "Advanced";
  else if (score >= 60) level = "Intermediate";
  else if (score >= 40) level = "Elementary";

  return (
    <div className="max-w-3xl mx-auto p-6 card">
      <h3 className="text-xl font-semibold mb-4">Step 3 — Hasil</h3>
      <div className="mb-4">
        <div className="text-sm text-gray-600">Nama: {form.name}</div>
        <div className="text-sm text-gray-600">WhatsApp: {form.whatsapp}</div>
      </div>

      <div className="p-4 bg-ibc-light rounded">
        <div className="text-3xl font-bold text-ibc-blue">{score}</div>
        <div className="text-sm text-gray-700">Skor</div>
        <div className="mt-3 text-lg font-semibold">Level: {level}</div>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={() => onSave({ form, score, level, answers })} className="px-4 py-2 bg-ibc-blue text-white rounded">Simpan Hasil</button>
        <button onClick={onRestart} className="px-4 py-2 border rounded">Ulangi</button>
      </div>
    </div>
  );
}

export default function PlacementTest() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", whatsapp: "", age: "", education: "" });
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(null);

  const handleSave = (result) => {
    // For now we store in localStorage for demo
    const store = JSON.parse(localStorage.getItem("placement_results") || "[]");
    store.unshift({ id: Date.now(), ...result, createdAt: new Date().toISOString() });
    localStorage.setItem("placement_results", JSON.stringify(store));
    setSaved(result);
    alert("Hasil disimpan di localStorage (demo).");
    setStep(1);
    setForm({ name: "", whatsapp: "", age: "", education: "" });
    setAnswers({});
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl font-bold text-ibc-blue mb-6">Placement Test</h1>

          {step === 1 && <Step1 form={form} setForm={setForm} onNext={() => setStep(2)} />}

          {step === 2 && <Step2 answers={answers} setAnswers={setAnswers} onPrev={() => setStep(1)} onNext={() => setStep(3)} />}

          {step === 3 && <Step3 form={form} answers={answers} onSave={handleSave} onRestart={() => { setStep(1); setAnswers({}); setForm({ name: "", whatsapp: "", age: "", education: ""}); }} />}

        </div>
      </main>
      <Footer />
    </div>
  );
}

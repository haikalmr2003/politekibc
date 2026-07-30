const handleSave = (result) => {
  const store = JSON.parse(localStorage.getItem("placement_results") || "[]");
  store.unshift({ id: Date.now(), ...result, createdAt: new Date().toISOString() });
  localStorage.setItem("placement_results", JSON.stringify(store));
  setSaved(result);
  alert("Hasil disimpan di localStorage (demo).");
  setStep(1);
  setForm({ name: "", whatsapp: "", age: "", education: "" });
  setAnswers({});
};

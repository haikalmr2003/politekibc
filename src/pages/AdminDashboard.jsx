import React, { useState, useEffect } from "react";

// NOTE: External libraries like @supabase/supabase-js and react-icons/fa 
// are expected to be installed in your local project environment.
// For preview purposes, please ensure these are available.
const createClient = (url, key) => ({
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null })
  })
});

const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY");

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="p-3 rounded bg-blue-50 text-blue-600">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, graduated: 0, leave: 0 });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("students").select("*");
        if (error) throw error;

        setStudents(data || []);
        setStats({
          total: data?.length || 0,
          active: data?.filter(s => s.status === 'Aktif').length || 0,
          graduated: data?.filter(s => s.status === 'Lulus').length || 0,
          leave: data?.filter(s => s.status === 'Cuti').length || 0,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Siswa" value={stats.total} icon={<span>👥</span>} />
          <StatCard title="Aktif" value={stats.active} icon={<span>✅</span>} />
          <StatCard title="Lulus" value={stats.graduated} icon={<span>🎓</span>} />
          <StatCard title="Cuti" value={stats.leave} icon={<span>📅</span>} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-4">Daftar Siswa</h2>
          {loading ? (
            <div className="text-center py-10">Memuat data...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500 border-b">
                  <th className="py-2">Nama</th>
                  <th className="py-2">Program</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3">{s.name || "N/A"}</td>
                    <td className="py-3">{s.program || "N/A"}</td>
                    <td className="py-3">{s.status || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

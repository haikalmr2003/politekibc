import React from "react";
import Sidebar from "../components/Sidebar";
import { FaUsers, FaUserCheck, FaCertificate, FaCalendarAlt } from "react-icons/fa";

/**
 * Minimal Admin Dashboard with sidebar, summary cards, chart (simple), and tables (dummy).
 */
function StatCard({ title, value, icon }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="p-3 rounded bg-ibc-light text-ibc-red">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  // Dummy summary values
  const stats = [
    { title: "Total Siswa", value: 1284, icon: <FaUsers /> },
    { title: "Aktif", value: 98, icon: <FaUserCheck /> },
    { title: "Lulus", value: 356, icon: <FaCertificate /> },
    { title: "Cuti", value: 14, icon: <FaCalendarAlt /> }
  ];
  const latestStudents = [
    { id: 1, name: "Asep", program: "Computer Basic", status: "Aktif" },
    { id: 2, name: "Sari", program: "Canva Design", status: "Lulus" },
    { id: 3, name: "Budi", program: "AI Productivity", status: "Aktif" }
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-ibc-blue mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map(s => <StatCard key={s.title} {...s} />)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 card p-4">
              <div className="font-semibold mb-2">Grafik Pertumbuhan (Dummy)</div>
              {/* Simple bar chart made with divs */}
              <div className="flex items-end gap-2 h-44 pt-6">
                {[10, 18, 14, 22, 30, 26, 34].map((v,i) => (
                  <div key={i} className="flex-1 bg-ibc-blue/20 rounded-t">
                    <div style={{height: `${v * 2}px`}} className="bg-ibc-red rounded-t w-full"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <div className="font-semibold mb-2">Placement Test Terbaru</div>
              <div className="text-sm text-gray-600">3 Hasil terbaru tersimpan (demo)</div>
              <ul className="mt-3 space-y-2">
                <li className="border rounded p-2 flex justify-between">
                  <div><div className="font-medium">Dina Putri</div><div className="text-xs text-gray-500">Advanced - 92</div></div>
                  <div className="text-sm text-gray-500">2026-07-01</div>
                </li>
                <li className="border rounded p-2 flex justify-between">
                  <div><div className="font-medium">Rian</div><div className="text-xs text-gray-500">Intermediate - 65</div></div>
                  <div className="text-sm text-gray-500">2026-06-20</div>
                </li>
                <li className="border rounded p-2 flex justify-between">
                  <div><div className="font-medium">Siti</div><div className="text-xs text-gray-500">Elementary - 52</div></div>
                  <div className="text-sm text-gray-500">2026-06-12</div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 card p-4">
            <div className="font-semibold mb-2">Tabel Siswa Terbaru</div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="py-2">Nama</th>
                  <th className="py-2">Program</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {latestStudents.map(s => (
                  <tr key={s.id} className="border-t">
                    <td className="py-2">{s.name}</td>
                    <td className="py-2">{s.program}</td>
                    <td className="py-2">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}

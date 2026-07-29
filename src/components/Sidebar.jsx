import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Sidebar for admin dashboard.
 */
export default function Sidebar() {
  const items = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/dashboard/students", label: "Data Siswa" },
    { to: "/admin/dashboard/placement", label: "Placement Test" },
    { to: "/admin/dashboard/stats", label: "Statistik" },
    { to: "/admin/dashboard/settings", label: "Pengaturan" }
  ];

  return (
    <aside className="w-64 bg-white p-4 border-r hidden md:block">
      <div className="font-bold text-ibc-blue mb-6">POLITEK IBC - Admin</div>
      <nav className="flex flex-col space-y-2">
        {items.map(it => (
          <NavLink key={it.to} to={it.to} className={({isActive}) => `p-2 rounded ${isActive ? "bg-ibc-red/10 text-ibc-red font-semibold" : "text-gray-700"}`}>
            {it.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

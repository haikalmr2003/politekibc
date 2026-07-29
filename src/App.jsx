import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlacementTest from "./pages/PlacementTest";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

/**
 * App routes are defined here. Keep routes organized to add new pages easily.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/placement-test" element={<PlacementTest />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      {/* Future routes go here */}
    </Routes>
  );
}

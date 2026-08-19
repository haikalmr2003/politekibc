import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/shared/Navbar';
import { Footer } from './components/shared/Footer';
import { FloatingWhatsAppButton } from './components/shared/FloatingWhatsAppButton';

// Features
import { LandingPage } from './features/landing/LandingPage';
import { PlacementTestPage } from './features/placement-test/PlacementTestPage';
import { CourseCatalogPage } from './features/course/CourseCatalogPage';
import { StudentDashboardPage } from './features/student/StudentDashboardPage';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { AuthPage } from './features/auth/AuthPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
        
        {/* Navigation Header */}
        <Navbar />

        {/* Main View Router */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/placement-test" element={<PlacementTestPage />} />
            <Route path="/programs" element={<CourseCatalogPage />} />
            <Route path="/student" element={<StudentDashboardPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/login" element={<AuthPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating WhatsApp Action Button */}
        <FloatingWhatsAppButton />
      </div>
    </BrowserRouter>
  );
}

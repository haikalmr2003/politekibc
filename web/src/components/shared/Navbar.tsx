import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { POLITEK_INFO } from '../../lib/config';
import politekLogo from '../../assets/politek_logo.jpg';
import { 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles, 
  LogIn
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleStartTest = () => {
    navigate('/placement-test');
  };

  const currentPath = location.pathname;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Bar - Red & Blue Branding */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <a 
              href={`https://wa.me/${POLITEK_INFO.whatsappNumber}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400/20" />
              <span>Konsultasi WA: {POLITEK_INFO.phone}</span>
            </a>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-blue-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              {POLITEK_INFO.accreditation}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Phone className="w-3 h-3 text-blue-400" />
              {POLITEK_INFO.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Institution Branding - Official Politek IBC Badge */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-200 shadow-sm group-hover:scale-105 group-hover:border-red-300 transition-all overflow-hidden">
              <img 
                src={politekLogo} 
                alt="Logo POLITEK IBC" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-blue-950 group-hover:text-red-600 transition-colors">
                  POLITEK <span className="text-red-600">IBC</span>
                </span>
                <span className="text-[10px] font-extrabold bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200 uppercase tracking-wide">
                  Course Center
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Lembaga Kursus Bahasa Inggris & Komputer Terakreditasi
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/'
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('programs')}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-900 hover:bg-slate-50 transition-colors"
            >
              Programs
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-900 hover:bg-slate-50 transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={handleStartTest}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-900 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <span>Placement Test</span>
              <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">FREE</span>
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-900 hover:bg-slate-50 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-900 hover:bg-slate-50 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Action Buttons: Placement Test CTA & Login */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleStartTest}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>Placement Test</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 border border-slate-300 hover:border-blue-900 text-slate-700 hover:text-blue-900 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all hover:bg-blue-50/50"
            >
              <LogIn className="w-4 h-4 text-blue-900" />
              <span>Login</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={handleStartTest}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              Tes Gratis
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => {
              navigate('/');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('programs')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Programs
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Pricing
          </button>
          <button
            onClick={() => {
              handleStartTest();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              Placement Test Online
            </span>
            <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">GRATIS</span>
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Contact
          </button>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-blue-900 text-blue-900 font-semibold text-sm hover:bg-blue-50"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


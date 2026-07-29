import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

/**
 * Navbar with transparent background at top and white bg on scroll.
 * Shows logo on the left and menu on the right with a primary CTA button.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed w-full z-30 transition-colors duration-300 ${scrolled ? "bg-white shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-ibc-blue font-bold leading-tight">
            <div className="text-lg md:text-xl">POLITEK IBC</div>
            <div className="text-xs text-gray-500">Digital Skill Center</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className={({isActive}) => isActive ? "text-ibc-blue font-semibold" : "text-gray-700"}>Home</NavLink>
          <a href="#program" className="text-gray-700">Program</a>
          <NavLink to="/placement-test" className="text-gray-700">Placement Test</NavLink>
          <a href="#about" className="text-gray-700">Tentang</a>
          <a href="#contact" className="text-gray-700">Kontak</a>
          <Link to="/admin/login" className="text-gray-500 hover:text-gray-700">Admin</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <Link to="/placement-test" className="px-4 py-2 border border-ibc-red rounded-md text-ibc-red font-medium hover:bg-ibc-red hover:text-white transition">Placement Test Gratis</Link>
          <a href="#daftar" className="px-4 py-2 bg-ibc-red text-white rounded-md font-semibold shadow">Daftar Sekarang</a>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setOpen(v => !v)} aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden bg-white shadow-sm">
          <div className="px-6 py-4 flex flex-col space-y-3">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <a href="#program" onClick={() => setOpen(false)}>Program</a>
            <Link to="/placement-test" onClick={() => setOpen(false)}>Placement Test</Link>
            <a href="#about" onClick={() => setOpen(false)}>Tentang</a>
            <a href="#contact" onClick={() => setOpen(false)}>Kontak</a>
            <div className="flex space-x-2">
              <a href="#daftar" className="flex-1 px-4 py-2 bg-ibc-red text-white rounded-md text-center">Daftar Sekarang</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

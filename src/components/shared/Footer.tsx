import React, { useEffect, useState } from 'react';
import { POLITEK_INFO } from '../../lib/config';
import { DatabaseService } from '../../services/database.service';
import { ContactSettings } from '../../types';
import politekLogo from '../../assets/politek_logo.jpg';
import { MapPin, Phone, Mail, ShieldCheck, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const [info, setInfo] = useState<ContactSettings>({
    locationName: POLITEK_INFO.locationName,
    address: POLITEK_INFO.address,
    phone: POLITEK_INFO.phone,
    whatsappNumber: POLITEK_INFO.whatsappNumber,
    email: POLITEK_INFO.email,
    openingHours: POLITEK_INFO.openingHours,
    mapsEmbedUrl: POLITEK_INFO.mapsEmbedUrl,
    mapsUrl: POLITEK_INFO.mapsUrl
  });

  useEffect(() => {
    DatabaseService.getContactSettings().then((data) => {
      if (data) setInfo(data);
    });
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-blue-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Accreditation */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-700 shadow-md shrink-0">
                <img 
                  src={politekLogo} 
                  alt="Logo POLITEK IBC" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                POLITEK <span className="text-red-500">IBC</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {POLITEK_INFO.tagline}. Berkomitmen mencetak lulusan berdaya saing global dengan penguasaan Bahasa Inggris teruji.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-red-400 text-xs font-semibold border border-red-500/30">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                {POLITEK_INFO.accreditation}
              </span>
            </div>
          </div>

          {/* Col 2: Program Kursus */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2">Program Kursus</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#programs" className="hover:text-red-400 transition-colors">General English (A1-B2)</a></li>
              <li><a href="#programs" className="hover:text-red-400 transition-colors">TOEFL Preparation Booster</a></li>
              <li><a href="#programs" className="hover:text-red-400 transition-colors">English Conversation Club</a></li>
              <li><a href="#programs" className="hover:text-red-400 transition-colors">Executive Business English</a></li>
              <li><a href="#programs" className="hover:text-red-400 transition-colors">Private 1-on-1 Mentoring</a></li>
            </ul>
          </div>

          {/* Col 3: Fast Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#home" className="hover:text-red-400 transition-colors">Beranda Utama</a></li>
              <li><a href="#about" className="hover:text-red-400 transition-colors">Keunggulan & Fasilitas</a></li>
              <li><a href="#pricing" className="hover:text-red-400 transition-colors">Pilihan Biaya & Pricing</a></li>
              <li><a href="#/placement-test" className="hover:text-red-400 transition-colors">Placement Test Online Gratis</a></li>
              <li><a href="#faq" className="hover:text-red-400 transition-colors">FAQ & Tanya Jawab</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2">Alamat & Kontak Kampus</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <a
                  href={info.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-snug hover:text-red-400 hover:underline transition-colors cursor-pointer"
                >
                  {info.address}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{info.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 hover:underline transition-colors"
                >
                  WhatsApp: {info.whatsappNumber === '628211409313' ? '08211409313' : (info.whatsappNumber.startsWith('62') ? '0' + info.whatsappNumber.slice(2) : info.whatsappNumber)}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{info.email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Politek IBC Jatibarang. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privasi</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Syarat & Ketentuan</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">BAN-PNF Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


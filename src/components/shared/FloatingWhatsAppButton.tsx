import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { POLITEK_INFO } from '../../lib/config';
import { DatabaseService } from '../../services/database.service';

export const FloatingWhatsAppButton: React.FC = () => {
  const [waNumber, setWaNumber] = useState(POLITEK_INFO.whatsappNumber);

  useEffect(() => {
    DatabaseService.getContactSettings()
      .then((data) => {
        if (data?.whatsappNumber) {
          setWaNumber(data.whatsappNumber);
        }
      })
      .catch(() => {});
  }, []);

  const cleanNumber = waNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Halo Admin Politek IBC Jatibarang, saya ingin bertanya seputar program kursus dan pendaftaran.')}`;

  const displayPhone = waNumber.startsWith('62') ? '0' + waNumber.slice(2) : waNumber;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi via WhatsApp"
      className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-50 group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-emerald-600/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/30"
    >
      <MessageCircle className="w-6 h-6 shrink-0 fill-white text-emerald-600" />
      <span className="hidden sm:inline font-bold text-xs tracking-wide">
        Konsultasi WA: {displayPhone}
      </span>
    </a>
  );
};

import React from "react";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

/**
 * Footer with logo, contact and social links.
 */
export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-ibc-blue font-bold">POLITEK IBC</div>
          <div className="text-sm text-gray-600">Digital Skill Center</div>
          <div className="mt-3 text-sm text-gray-600">Jl. Contoh Alamat No.123, Kota, Negara</div>
        </div>

        <div className="text-sm text-gray-700">
          <div className="font-semibold mb-2">Kontak</div>
          <div>WhatsApp: +62 812-3456-7890</div>
          <div className="mt-2">Instagram: @politekibc</div>
        </div>

        <div>
          <div className="font-semibold mb-2">Sosial</div>
          <div className="flex items-center gap-3 text-ibc-blue">
            <FaWhatsapp />
            <FaInstagram />
            <FaFacebook />
            <FaTiktok />
          </div>
          <div className="text-xs text-gray-500 mt-4">&copy; {new Date().getFullYear()} POLITEK IBC. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { POLITEK_INFO } from '../../../lib/config';
import { DatabaseService } from '../../../services/database.service';
import { ContactSettings } from '../../../types';

export const ContactSection: React.FC = () => {
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
    DatabaseService.getContactSettings()
      .then((data) => {
        if (data) {
          setInfo(data);
        }
      })
      .catch((err) => {
        console.warn("Could not load contact settings from database:", err);
      });
  }, []);

  return (
    <section id="contact" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-full">
            Hubungi Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
            Alamat & Kontak Politek IBC Jatibarang
          </h2>
          <p className="text-slate-600 text-base">
            Kunjungi kampus Politek IBC Jatibarang atau berkonsultasi langsung melalui layanan WhatsApp dan Email resmi kami.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Cards: Contact Info & Office Hours */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Card 1: Address & Phone */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <span>Alamat & Layanan Kontak</span>
              </h3>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Alamat Kampus</span>
                    <p className="leading-relaxed">{info.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Telepon Utama</span>
                    <p className="font-medium text-slate-800">{info.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">WhatsApp Official</span>
                    <a 
                      href={`https://wa.me/${info.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <span>{info.whatsappNumber === '628211409313' ? '08211409313' : (info.whatsappNumber.startsWith('62') ? '0' + info.whatsappNumber.slice(2) : info.whatsappNumber)}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Email Pertanyaan</span>
                    <p className="font-medium text-slate-800">{info.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card 2: Operating Hours */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span>Jam Operasional Sekretariat</span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-700">
                <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 font-semibold text-blue-900">
                  {info.openingHours}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full h-96 sm:h-[420px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              {/* Maps Embed */}
              <iframe
                title="Lokasi Kampus Politek IBC Jatibarang"
                src={info.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[0.2] contrast-[1.05]"
              />

              {/* Map Floating Card Badge / Popup Marker */}
              <div className="absolute top-4 left-4 bg-slate-950/90 text-white p-4 rounded-xl backdrop-blur-md border border-slate-800 text-xs shadow-lg max-w-xs space-y-2">
                <div className="flex items-center gap-2 text-red-500 font-bold">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="tracking-wide">{info.locationName}</span>
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed space-y-0.5">
                  <p className="font-semibold text-white">Jl. Tentara Pelajar No. 03</p>
                  <p>Desa Jatibarang</p>
                  <p>Kecamatan Jatibarang</p>
                  <p>Kabupaten Indramayu</p>
                  <p>Jawa Barat</p>
                  <p>Indonesia</p>
                </div>
                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <a
                    href={info.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Petunjuk Arah</span>
                  </a>
                  <a
                    href={info.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka di Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

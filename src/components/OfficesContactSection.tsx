import React, { useState } from 'react';
import { OFFICE_CONTACTS } from '../data/mockData';
import { OfficeContact } from '../types';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink,
  LifeBuoy
} from 'lucide-react';

interface OfficesContactSectionProps {
  isCompact?: boolean;
  onSelectOffice?: (office: OfficeContact) => void;
}

export const OfficesContactSection: React.FC<OfficesContactSectionProps> = ({ 
  isCompact = false 
}) => {
  const [selectedCountry, setSelectedCountry] = useState<'UAE' | 'India'>('UAE');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeOffice = OFFICE_CONTACTS.find(o => o.country === selectedCountry) || OFFICE_CONTACTS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-100 shadow-sm space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#051b34] tracking-tight">
                Our Global Offices &amp; Direct Support
              </h3>
              <p className="text-xs text-slate-500">
                Official Head Office in the UAE and Branch Office in India
              </p>
            </div>
          </div>
        </div>

        {/* Office Country Selector Switch */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl self-start sm:self-auto border border-slate-200">
          <button
            id="tab-uae-office"
            onClick={() => setSelectedCountry('UAE')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCountry === 'UAE'
                ? 'bg-[#051b34] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇦🇪</span> UAE Head Office
          </button>
          <button
            id="tab-india-office"
            onClick={() => setSelectedCountry('India')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCountry === 'India'
                ? 'bg-[#051b34] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇮🇳</span> India Branch
          </button>
        </div>
      </div>

      {/* Selected Office Card Detail */}
      <div className="bg-gradient-to-br from-sky-50/70 via-white to-sky-50/40 rounded-2xl p-4 sm:p-5 border border-sky-200/80 space-y-4">
        {/* Office Title & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {activeOffice.country === 'UAE' ? '🇦🇪' : '🇮🇳'}
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100/90 px-2.5 py-0.5 rounded-full">
                {activeOffice.type}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {activeOffice.city}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#051b34] mt-1">
              {activeOffice.title}
            </h4>
          </div>

          <div className="flex flex-wrap gap-1">
            {activeOffice.badges.map((badge, idx) => (
              <span 
                key={idx}
                className="text-[10px] font-medium bg-white border border-sky-200 text-sky-900 px-2 py-0.5 rounded-lg shadow-2xs"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-sky-100 text-xs">
          <MapPin className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-slate-900 block mb-0.5">Physical Address:</span>
            {activeOffice.address.map((line, i) => (
              <div key={i} className="text-slate-600 leading-snug">{line}</div>
            ))}
          </div>
          <button
            onClick={() => handleCopy(activeOffice.address.join(', '), 'address')}
            className="p-1.5 rounded-lg hover:bg-sky-50 text-slate-500 hover:text-sky-700 transition-colors"
            title="Copy address"
          >
            {copiedId === 'address' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Contact Grid: Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Phone Numbers */}
          <div className="bg-white p-3 rounded-xl border border-sky-100 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Direct Telephones</span>
            </div>
            <div className="space-y-1">
              {activeOffice.phones.map((phone, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <a 
                    href={`tel:${phone.replace(/\s+/g, '')}`} 
                    className="font-bold text-[#051b34] hover:text-sky-600 transition-colors"
                  >
                    {phone}
                  </a>
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md hover:bg-sky-100"
                  >
                    Call
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp & Email */}
          <div className="bg-white p-3 rounded-xl border border-sky-100 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp &amp; Email</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">WhatsApp:</span>
                <a 
                  href={`https://wa.me/${activeOffice.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1"
                >
                  {activeOffice.whatsapp}
                </a>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="font-semibold text-slate-700">Email:</span>
                <a 
                  href={`mailto:${activeOffice.email}`}
                  className="font-bold text-sky-700 hover:underline"
                >
                  {activeOffice.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Timings & Emergency Hotline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Hours: {activeOffice.workingHours}</span>
          </div>

          {activeOffice.emergencySupport && (
            <div className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <LifeBuoy className="w-3 h-3 text-amber-600" />
              <span>24/7 Hotline: {activeOffice.emergencySupport}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
        <a
          href={`https://wa.me/${activeOffice.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20InspireGo%2C%20I%20would%20like%20to%20inquire%20about%20travel%20packages%20and%20visas.`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Chat on WhatsApp</span>
        </a>

        <a
          href={`tel:${activeOffice.phones[0].replace(/\s+/g, '')}`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#051b34] hover:bg-[#0a274c] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Office</span>
        </a>

        <a
          href={`mailto:${activeOffice.email}?subject=Travel%20Inquiry%20-%20InspireGo`}
          className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Send Inquiry</span>
        </a>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UMRAH_PACKAGES } from '../data/mockData';
import { 
  Moon, 
  Check, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Train, 
  Award, 
  Heart, 
  Calendar, 
  Users, 
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { UmrahPackage } from '../types';

export const UmrahView: React.FC = () => {
  const { formatPrice, startBookingFlow } = useApp();
  const [activeTab, setActiveTab] = useState<'packages' | 'guide' | 'hotels'>('packages');
  const [selectedUmrah, setSelectedUmrah] = useState<UmrahPackage | null>(null);
  const [travelersCount, setTravelersCount] = useState<number>(2);

  const ritualsSteps = [
    {
      step: 1,
      title: 'Ihram & Niyyah (Intention)',
      arabic: 'الإحرام والنية',
      desc: 'Donning the clean two-piece white unstitched sheets (for men) or modest attire (for women) at the Miqat boundary. Pronouncing the Niyyah and reciting the Talbiyah continuously: "Labbayk Allahumma Labbayk".',
      tip: 'Do not use scented perfumes, soaps, or cut hair/nails after entering the state of Ihram.'
    },
    {
      step: 2,
      title: 'Tawaf al-Umrah (7 Circuits)',
      arabic: 'طواف العمرة',
      desc: 'Circling the Holy Kaaba 7 times counter-clockwise, beginning and ending at the Black Stone (Hajar al-Aswad) corner while making supplication (Du’a).',
      tip: 'Men perform Idtiba (uncovering right shoulder) and Raml (brisk walking) in the first 3 circuits.'
    },
    {
      step: 3,
      title: 'Maqam Ibrahim Prayer',
      arabic: 'صلاة ركعتين خلف مقام إبراهيم',
      desc: 'Offer two voluntary Rakahs of prayer behind or near Station of Abraham (Maqam Ibrahim) or anywhere in the Grand Mosque, followed by drinking blessed Zamzam water.',
      tip: 'Make earnest personal Du’a facing the Kaaba while drinking Zamzam.'
    },
    {
      step: 4,
      title: 'Sa’i between Safa and Marwa',
      arabic: 'السعي بين الصفا والمروة',
      desc: 'Walking 7 laps between the hills of Safa and Marwa (beginning at Safa, ending at Marwa) honoring the devotion of Lady Hajar (AS).',
      tip: 'Men run lightly between the two green fluorescent light pillars.'
    },
    {
      step: 5,
      title: 'Halq or Taqsir (Completion)',
      arabic: 'الحلق أو التقصير',
      desc: 'Men shave their head (Halq) or trim hair equally (Taqsir); women trim an inch (fingertip length) from their hair. The Umrah is now fulfilled and Ihram is exited.',
      tip: 'InspireGO provides complimentary sanitised barber service vouchers in your package kit.'
    }
  ];

  const handleBookUmrah = (pkg: UmrahPackage) => {
    startBookingFlow({
      itemType: 'umrah',
      itemId: pkg.id,
      title: pkg.name,
      destination: 'Makkah & Madinah, Saudi Arabia',
      startDate: '2026-10-15',
      endDate: '2026-10-25',
      travelersCount,
      totalAmountUSD: pkg.pricePerPerson * travelersCount
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#051b34] via-[#082a52] to-[#041529] text-white p-6 sm:p-8 shadow-xl border border-sky-400/20">
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold backdrop-blur-md border border-amber-400/30">
            <Moon className="w-3.5 h-3.5 fill-current" />
            Sacred Umrah Pilgrimage Services
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Perform Your Umrah with Serenity & Complete Peace of Mind
          </h1>

          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
            Direct Haram courtyard access in Makkah & Madinah, Nusuk Rawdah appointments, Haramain Bullet Train, and personalized Mutawwif guidance throughout your journey.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Check className="w-4 h-4 text-amber-400" /> 0m Haram Hotels
            </div>
            <div className="flex items-center gap-1.5 text-teal-200 font-semibold">
              <Train className="w-4 h-4 text-teal-300" /> Bullet Train
            </div>
            <div className="flex items-center gap-1.5 text-emerald-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> Nusuk Permit Guaranteed
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-sky-100 shadow-2xs">
        <button
          id="umrah-tab-packages"
          onClick={() => setActiveTab('packages')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'packages'
              ? 'bg-[#051b34] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Umrah Packages
        </button>
        <button
          id="umrah-tab-guide"
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'guide'
              ? 'bg-[#051b34] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Rituals Guide
        </button>
      </div>

      {/* View: Packages List */}
      {activeTab === 'packages' && (
        <div className="space-y-4">
          {UMRAH_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              id={`umrah-package-${pkg.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-2xs hover:shadow-xl transition-all"
            >
              <div className="relative h-48 sm:h-56 w-full">
                <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                    {pkg.tier}
                  </span>
                  <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {pkg.tag}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-lg sm:text-xl font-black leading-tight drop-shadow">
                    {pkg.name}
                  </h3>
                  <div className="text-xs text-amber-200 mt-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Hotels Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Makkah Hotel</div>
                    <div className="text-xs font-bold text-slate-900">{pkg.makkahHotel.name}</div>
                    <div className="text-[11px] text-sky-700 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {pkg.makkahHotel.distance}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Madinah Hotel</div>
                    <div className="text-xs font-bold text-slate-900">{pkg.madinahHotel.name}</div>
                    <div className="text-[11px] text-sky-700 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {pkg.madinahHotel.distance}
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    What Makes This Journey Special
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pkg.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Booking Trigger */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400">Package rate per person</span>
                    <div className="text-2xl font-black text-[#051b34]">
                      {formatPrice(pkg.pricePerPerson)}
                      <span className="text-xs font-normal text-slate-500 ml-1.5">
                        (All taxes & e-visa assist included)
                      </span>
                    </div>
                  </div>

                  <button
                    id={`book-umrah-cta-${pkg.id}`}
                    onClick={() => handleBookUmrah(pkg)}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 active:scale-95 text-white font-bold text-sm shadow-md shadow-sky-700/20 flex items-center justify-center gap-2 transition-all"
                  >
                    Book This Umrah Package <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View: Rituals Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-2xs space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Complete Step-by-Step Umrah Spiritual Guide
            </h2>
            <p className="text-xs text-slate-600">
              Review each essential ritual step from Ihram to Halq. All InspireGo pilgrims receive a pocket printed checklist and audio recitation companion.
            </p>
          </div>

          <div className="space-y-3">
            {ritualsSteps.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-sky-100 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#051b34] text-white text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h3>
                  </div>
                  <span className="text-sm font-semibold text-sky-800 font-serif" dir="rtl">
                    {step.arabic}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pl-9">
                  {step.desc}
                </p>

                <div className="ml-9 p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-amber-900 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  <span><strong>Important tip:</strong> {step.tip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

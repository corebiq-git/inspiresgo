import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PACKAGES } from '../data/mockData';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Check, 
  Users, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Plane,
  Building2,
  Coffee
} from 'lucide-react';
import { TravelPackage } from '../types';

export const PackagesView: React.FC = () => {
  const { formatPrice, startBookingFlow } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [chosenDate, setChosenDate] = useState<string>('2026-06-01');

  const categories = ['All', 'Europe', 'Adventure', 'Asia'];

  const filteredPackages = PACKAGES.filter(p => {
    if (selectedCategory === 'All') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleOpenDetail = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    setChosenDate(pkg.availableDates[0] || '2026-06-01');
    setTravelersCount(2);
  };

  const handleProceedBooking = () => {
    if (!selectedPackage) return;
    const pkg = selectedPackage;
    setSelectedPackage(null);
    startBookingFlow({
      itemType: 'package',
      itemId: pkg.id,
      title: pkg.title,
      destination: pkg.destination,
      startDate: chosenDate,
      endDate: '2026-06-08',
      travelersCount,
      totalAmountUSD: pkg.price * travelersCount
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Upcoming Tour Packages
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          All-inclusive curated journeys with luxury stays, guided excursions, and guaranteed departures.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`pkg-filter-${cat.toLowerCase()}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#051b34] text-white shadow-md shadow-sky-950/20'
                : 'bg-white text-slate-600 border border-sky-100 hover:border-sky-300'
            }`}
          >
            {cat} Packages
          </button>
        ))}
      </div>

      {/* Package Cards List */}
      <div className="space-y-4">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            id={`pkg-item-${pkg.id}`}
            className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-2xs hover:shadow-lg transition-all flex flex-col md:flex-row"
          >
            {/* Image */}
            <div className="relative md:w-2/5 h-52 md:h-auto overflow-hidden">
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#051b34]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                {pkg.tag}
              </span>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold">{pkg.rating}</span>
                <span className="text-slate-300 text-[10px]">({pkg.reviewsCount})</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 md:w-3/5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-sky-600 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{pkg.destination}</span>
                </div>

                <h3 className="text-lg font-black text-[#051b34] leading-tight">
                  {pkg.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {pkg.days} Days / {pkg.nights} Nights
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-sky-700">
                    <Plane className="w-3.5 h-3.5" />
                    Flights Included
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-amber-700">
                    <Building2 className="w-3.5 h-3.5" />
                    5★ Stays
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {pkg.inclusions.slice(0, 3).map((inc, i) => (
                    <span key={i} className="text-[11px] bg-sky-50/50 border border-sky-100 text-slate-600 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Check className="w-3 h-3 text-sky-600" /> {inc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Total per person</span>
                  <div className="text-xl font-black text-[#051b34]">
                    {formatPrice(pkg.price)}
                    {pkg.originalPrice && (
                      <span className="text-xs text-slate-400 line-through ml-2 font-normal">
                        {formatPrice(pkg.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDetail(pkg)}
                    className="px-3.5 py-2.5 rounded-xl border border-sky-200 text-sky-800 hover:bg-sky-50 text-xs font-bold transition-all"
                  >
                    View Itinerary
                  </button>
                  <button
                    id={`book-pkg-direct-${pkg.id}`}
                    onClick={() => handleOpenDetail(pkg)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white text-xs font-bold shadow-md shadow-sky-700/20 transition-all flex items-center gap-1"
                  >
                    Book Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Itinerary Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 flex flex-col">
            {/* Modal Header Image */}
            <div className="relative h-52 w-full flex-shrink-0">
              <img src={selectedPackage.imageUrl} alt={selectedPackage.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center font-bold text-sm backdrop-blur-sm"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-xs font-bold bg-[#051b34] px-2.5 py-0.5 rounded-full">
                  {selectedPackage.days} Days / {selectedPackage.nights} Nights
                </span>
                <h3 className="text-xl font-black mt-1 drop-shadow">
                  {selectedPackage.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Departure Date & Travelers selector */}
              <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#051b34]">
                  Select Travel Preferences
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Departure Date
                    </label>
                    <select
                      value={chosenDate}
                      onChange={(e) => setChosenDate(e.target.value)}
                      className="w-full text-xs font-bold bg-white border border-sky-200 rounded-xl p-2 text-slate-800"
                    >
                      {selectedPackage.availableDates.map((date) => (
                        <option key={date} value={date}>
                          {date} (Guaranteed Departure)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Travelers
                    </label>
                    <div className="flex items-center justify-between bg-white border border-sky-200 rounded-xl px-2 py-1.5">
                      <button
                        onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                        className="w-6 h-6 rounded bg-slate-100 text-slate-800 font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-900">
                        {travelersCount} Person{travelersCount > 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => setTravelersCount(travelersCount + 1)}
                        className="w-6 h-6 rounded bg-slate-100 text-slate-800 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Timeline */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-[#051b34] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  Day-by-Day Itinerary Schedule
                </h4>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-sky-100">
                  {selectedPackage.itinerary.map((day) => (
                    <div key={day.day} className="relative flex items-start gap-3 pl-2">
                      <div className="w-4 h-4 rounded-full bg-sky-600 text-white text-[9px] font-bold flex items-center justify-center ring-4 ring-white flex-shrink-0 z-10">
                        {day.day}
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1">
                        <div className="text-xs font-bold text-slate-900">{day.title}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">{day.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Included in This Package
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPackage.inclusions.map((inc, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl">
                      <Check className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-3xl">
              <div>
                <span className="text-[11px] text-slate-400">
                  Total for {travelersCount} traveler{travelersCount > 1 ? 's' : ''}
                </span>
                <div className="text-2xl font-black text-[#051b34]">
                  {formatPrice(selectedPackage.price * travelersCount)}
                </div>
              </div>

              <button
                id="modal-proceed-booking-btn"
                onClick={handleProceedBooking}
                className="px-6 py-3 rounded-2xl bg-[#051b34] hover:bg-sky-950 text-white font-bold text-sm shadow-lg flex items-center gap-2"
              >
                Proceed to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

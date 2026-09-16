import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DESTINATIONS, PACKAGES, UMRAH_PACKAGES } from '../data/mockData';
import { OfficesContactSection } from './OfficesContactSection';
import { InspireGoLogo } from './InspireGoLogo';
import { 
  Search, 
  Heart, 
  Star, 
  ArrowUpRight, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Moon, 
  FileCheck2, 
  PlaneTakeoff, 
  Check, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Building2,
  PhoneCall,
  Compass
} from 'lucide-react';
import { Destination, TravelPackage } from '../types';

export const HomeView: React.FC = () => {
  const { 
    user,
    formatPrice, 
    toggleSaveItem, 
    isSaved, 
    startBookingFlow, 
    setActiveTab, 
    setIsChatOpen 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All country');
  const [selectedDestinationDetail, setSelectedDestinationDetail] = useState<Destination | null>(null);

  const countryChips = [
    { label: 'All country', icon: true },
    { label: 'Canada' },
    { label: 'Saudi Arabia' },
    { label: 'Italy' },
    { label: 'Switzerland' },
    { label: 'Japan' },
    { label: 'Indonesia' }
  ];

  const filteredDestinations = DESTINATIONS.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = 
      selectedCountry === 'All country' || 
      item.country.toLowerCase() === selectedCountry.toLowerCase();
    return matchesSearch && matchesCountry;
  });

  const trendingDestinations = DESTINATIONS.filter(d => d.featured);

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Official Requested Welcome Card for Fathima */}
      <div 
        id="fathima-welcome-card"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#051b34] via-[#082a52] to-[#041529] text-white p-5 sm:p-7 shadow-xl border border-sky-400/20"
      >
        {/* Subtle decorative geometric backdrop rings */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>InspireGo Signature Member</span>
            </div>
            
            {/* Global Offices Direct Pill */}
            <button
              onClick={() => {
                const el = document.getElementById('offices-contact-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-200 bg-white/10 hover:bg-white/20 border border-sky-400/20 px-3 py-1 rounded-full transition-all"
            >
              <Building2 className="w-3 h-3 text-sky-300" />
              <span>UAE Head Office & India Branch</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome Back {user.fullName || 'Fathima'},
            </h2>
            <p className="text-base sm:text-lg font-medium text-sky-200 mt-1">
              Travel with the ones who inspire you.
            </p>
            <p className="text-xs sm:text-sm text-sky-100/90 font-normal leading-relaxed mt-1.5 max-w-xl">
              Your journey is more than a destination. With InspireGo.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={() => setActiveTab('ai-planner')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 text-[#051b34] font-black hover:from-sky-400 hover:to-sky-300 transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Plan with AI
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-sky-300" />
              Curated Packages
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('offices-contact-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 text-sky-200 font-semibold border border-sky-500/30 transition-all flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
              Contact Our Offices
            </button>
          </div>
        </div>
      </div>

      {/* Search Header Banner */}
      <section className="space-y-3 pt-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#051b34] tracking-tight leading-tight">
          Find your <br className="hidden sm:inline" />
          <span className="text-sky-600 font-black">Favourite place</span>
        </h1>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <input
            id="home-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations, Umrah, hotels..."
            className="w-full pl-11 pr-14 py-3.5 bg-white rounded-2xl border border-sky-100 shadow-2xs text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
          <Search className="absolute left-4 w-4 h-4 text-slate-400" />
          <div className="absolute right-2 p-2 bg-sky-50 rounded-xl text-sky-700">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
        </div>

        {/* Country Filter Chips Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {countryChips.map((chip) => {
            const active = selectedCountry.toLowerCase() === chip.label.toLowerCase();
            return (
              <button
                key={chip.label}
                id={`chip-${chip.label.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedCountry(chip.label)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#051b34] text-white shadow-md shadow-sky-950/20'
                    : 'bg-white text-slate-600 border border-sky-100 hover:border-sky-300'
                }`}
              >
                {chip.icon && (
                  <span className="text-[10px] opacity-75">❖</span>
                )}
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Quick Action Grid (All Key Verticals Requested) */}
      <section className="grid grid-cols-4 gap-2.5 sm:gap-3">
        <button
          id="quick-action-packages"
          onClick={() => setActiveTab('packages')}
          className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-sky-100 shadow-2xs hover:border-sky-300 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-700 mt-1.5 text-center leading-tight">Packages</span>
        </button>

        <button
          id="quick-action-umrah"
          onClick={() => setActiveTab('umrah')}
          className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-sky-100 shadow-2xs hover:border-sky-300 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Moon className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-700 mt-1.5 text-center leading-tight">Umrah</span>
        </button>

        <button
          id="quick-action-visa"
          onClick={() => setActiveTab('evisa')}
          className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-sky-100 shadow-2xs hover:border-sky-300 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-700 mt-1.5 text-center leading-tight">E-Visa</span>
        </button>

        <button
          id="quick-action-flights"
          onClick={() => setActiveTab('flights')}
          className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-sky-100 shadow-2xs hover:border-sky-300 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlaneTakeoff className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-700 mt-1.5 text-center leading-tight">Radar</span>
        </button>
      </section>

      {/* Spotlight Promo: AI Itinerary Banner */}
      <div 
        onClick={() => setActiveTab('ai-planner')}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#051b34] via-[#093566] to-[#0369a1] text-white p-5 shadow-lg shadow-sky-950/10 cursor-pointer group"
      >
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="space-y-1 max-w-[70%]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-sky-300" /> Gemini AI Travel Architect
            </div>
            <h3 className="text-base sm:text-lg font-bold leading-tight">
              Plan Your Bespoke Dream Journey
            </h3>
            <p className="text-xs text-sky-100 line-clamp-2">
              Get personalized day-by-day itineraries with hidden local spots & budget optimization in seconds.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
            <Sparkles className="w-6 h-6 text-sky-300" />
          </div>
        </div>
      </div>

      {/* Trending Section (Banff National Park 5.0, Venice, etc.) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#051b34] tracking-tight">Trending</h2>
          <button 
            id="trending-see-all-btn"
            onClick={() => setActiveTab('packages')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5"
          >
            See All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trendingDestinations.map((destination) => (
            <div
              key={destination.id}
              id={`trending-card-${destination.id}`}
              className="group relative rounded-3xl overflow-hidden bg-white border border-sky-100 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Top Floating Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/20 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{destination.rating.toFixed(1)}</span>
                  </div>

                  {/* Bookmark Heart Button */}
                  <button
                    id={`fav-btn-${destination.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveItem(destination.id);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 ${
                      isSaved(destination.id)
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                        : 'bg-black/40 text-white hover:bg-black/60 border border-white/20'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved(destination.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Bottom Overlay Info & Arrow Action */}
                <div className="absolute bottom-3 inset-x-4 flex items-end justify-between text-white">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-extrabold tracking-tight drop-shadow-sm">
                      {destination.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-sky-200 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-sky-300" />
                      <span>{destination.location}</span>
                    </div>
                  </div>

                  {/* Arrow Action Button */}
                  <button
                    id={`view-dest-btn-${destination.id}`}
                    onClick={() => setSelectedDestinationDetail(destination)}
                    className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg group-hover:bg-sky-600 group-hover:text-white transition-all flex-shrink-0"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Card Meta Bar */}
              <div className="px-4 py-3 bg-white flex items-center justify-between text-xs">
                <div className="text-slate-500 font-medium">
                  Starting from <span className="text-sm font-extrabold text-[#051b34]">{formatPrice(destination.pricePerPerson)}</span> / person
                </div>
                <button
                  onClick={() => setSelectedDestinationDetail(destination)}
                  className="font-bold text-sky-600 hover:text-sky-800"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Official Contact Section: UAE Head Office & India Branch */}
      <section id="offices-contact-section" className="scroll-mt-20">
        <OfficesContactSection />
      </section>

      {/* Umrah Services Highlights Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-100 text-amber-800 text-xs">🕋</span>
            <h2 className="text-lg font-extrabold text-[#051b34] tracking-tight">Umrah Services & Packages</h2>
          </div>
          <button 
            id="umrah-see-all-btn"
            onClick={() => setActiveTab('umrah')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5"
          >
            All Umrah <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {UMRAH_PACKAGES.slice(0, 2).map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl p-4 border border-amber-100/70 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                    5★
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                    {pkg.tier}
                  </span>
                  <h4 className="text-sm font-extrabold text-[#051b34] leading-tight">
                    {pkg.name}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{pkg.duration}</span>
                    <span>•</span>
                    <span className="text-sky-700 font-semibold">{pkg.makkahHotel.distance}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-400">Package price</div>
                  <div className="text-base font-black text-[#051b34]">
                    {formatPrice(pkg.pricePerPerson)} <span className="text-xs font-normal text-slate-500">/ traveler</span>
                  </div>
                </div>
                <button
                  id={`book-home-umrah-${pkg.id}`}
                  onClick={() => startBookingFlow({
                    itemType: 'umrah',
                    itemId: pkg.id,
                    title: pkg.name,
                    destination: 'Makkah & Madinah, Saudi Arabia',
                    startDate: '2026-10-15',
                    endDate: '2026-10-25',
                    travelersCount: 2,
                    totalAmountUSD: pkg.pricePerPerson * 2
                  })}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white text-xs font-bold shadow-2xs transition-all"
                >
                  Book Umrah
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Packages (Europe, Asia, Alpine) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#051b34] tracking-tight">Upcoming Packages</h2>
          <button 
            id="packages-see-all-btn"
            onClick={() => setActiveTab('packages')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5"
          >
            Explore <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-2xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-44 w-full">
                <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#051b34]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {pkg.tag}
                </span>
                <span className="absolute top-3 right-3 bg-white/95 text-slate-900 text-xs font-extrabold px-2 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {pkg.rating}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="text-xs text-sky-600 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {pkg.destination}
                  </div>
                  <h3 className="text-sm font-extrabold text-[#051b34] leading-snug">
                    {pkg.title}
                  </h3>
                  <div className="text-xs text-slate-500">
                    {pkg.days} Days / {pkg.nights} Nights • Flights & 5★ Hotel Included
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400">From</span>
                    <div className="text-base font-black text-[#051b34]">
                      {formatPrice(pkg.price)}
                    </div>
                  </div>
                  <button
                    id={`book-pkg-btn-${pkg.id}`}
                    onClick={() => startBookingFlow({
                      itemType: 'package',
                      itemId: pkg.id,
                      title: pkg.title,
                      destination: pkg.destination,
                      startDate: pkg.availableDates[0] || '2026-06-01',
                      endDate: '2026-06-08',
                      travelersCount: 2,
                      totalAmountUSD: pkg.price * 2
                    })}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white text-xs font-bold shadow-2xs transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destination Detail Modal */}
      {selectedDestinationDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95">
            <div className="relative h-60 w-full">
              <img 
                src={selectedDestinationDetail.imageUrl} 
                alt={selectedDestinationDetail.name} 
                className="w-full h-full object-cover" 
              />
              <button
                onClick={() => setSelectedDestinationDetail(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center font-bold text-sm backdrop-blur-sm"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-xs font-bold bg-sky-600 px-2 py-0.5 rounded-full">
                  ★ {selectedDestinationDetail.rating} ({selectedDestinationDetail.reviewsCount} reviews)
                </span>
                <h3 className="text-xl font-black mt-1 drop-shadow">
                  {selectedDestinationDetail.name}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Location</h4>
                <p className="text-sm font-bold text-slate-800">{selectedDestinationDetail.location}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Overview</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                  {selectedDestinationDetail.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Highlights</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedDestinationDetail.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700 bg-sky-50/70 p-2 rounded-xl border border-sky-100/50">
                      <Check className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Starting price</span>
                  <div className="text-xl font-black text-[#051b34]">
                    {formatPrice(selectedDestinationDetail.pricePerPerson)}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const dest = selectedDestinationDetail;
                    setSelectedDestinationDetail(null);
                    startBookingFlow({
                      itemType: 'package',
                      itemId: dest.id,
                      title: dest.name,
                      destination: dest.location,
                      startDate: '2026-07-01',
                      endDate: '2026-07-06',
                      travelersCount: 2,
                      totalAmountUSD: dest.pricePerPerson * 2
                    });
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#051b34] hover:bg-sky-950 text-white font-bold text-sm shadow-md"
                >
                  Proceed to Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

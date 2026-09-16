import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCIES } from '../context/AppContext';
import { InspireGoLogo } from './InspireGoLogo';
import { 
  Home, 
  Compass, 
  User, 
  Sparkles, 
  Bell, 
  Moon, 
  FileCheck2, 
  PlaneTakeoff, 
  Smartphone, 
  Monitor, 
  HelpCircle,
  Building2,
  Bookmark
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { 
    user, 
    activeCurrency, 
    setActiveCurrency, 
    viewMode, 
    setViewMode, 
    setShowOnboarding,
    setActiveTab,
    bookings,
    savedWishlist
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-2xs px-3.5 py-2.5 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: User Welcome & Avatar */}
        <div 
          onClick={() => setActiveTab('profile')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="relative">
            <img 
              src={user.avatarUrl} 
              alt={user.fullName} 
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-sky-500/30 group-hover:ring-sky-600 transition-all shadow-sm" 
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
              Welcome back
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-[#051b34] leading-tight group-hover:text-sky-600 transition-colors flex items-center gap-1.5">
              {user.fullName}
              <span className="text-[9px] sm:text-[10px] font-bold bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded-full hidden sm:inline-block">
                ★ Gold Tier
              </span>
            </div>
          </div>
        </div>

        {/* Center: Official InspireGo Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          title="InspireGo Home"
        >
          <InspireGoLogo size="sm" showSubtitle={true} className="scale-95 sm:scale-100" />
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Offices UAE / India Quick Trigger */}
          <button
            id="header-offices-btn"
            onClick={() => {
              setActiveTab('home');
              setTimeout(() => {
                const el = document.getElementById('offices-contact-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#051b34] text-[11px] font-bold shadow-2xs transition-all flex items-center gap-1"
            title="UAE Head Office & India Branch Contacts"
          >
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden md:inline">Offices:</span>
            <span className="text-[11px]">🇦🇪 🇮🇳</span>
          </button>

          {/* Currency Switcher */}
          <select
            id="currency-selector"
            value={activeCurrency}
            onChange={(e) => setActiveCurrency(e.target.value)}
            className="text-[11px] sm:text-xs font-bold bg-white border border-sky-200 text-[#051b34] rounded-xl px-2 py-1.5 shadow-2xs focus:outline-none focus:ring-1 focus:ring-sky-600"
            title="Choose Currency"
          >
            {Object.keys(CURRENCIES).map(code => (
              <option key={code} value={code}>
                {CURRENCIES[code].symbol} {code}
              </option>
            ))}
          </select>

          {/* Device Frame View Toggle */}
          <button
            id="viewmode-toggle-btn"
            onClick={() => setViewMode(viewMode === 'mobile' ? 'fluid' : 'mobile')}
            className="p-1.5 sm:p-2 rounded-xl bg-white border border-sky-200 text-slate-700 hover:text-sky-700 hover:border-sky-300 shadow-2xs transition-all hidden sm:flex items-center gap-1 text-xs font-semibold"
            title={viewMode === 'mobile' ? 'Switch to Fluid Desktop' : 'Switch to Mobile App Preview'}
          >
            {viewMode === 'mobile' ? (
              <>
                <Monitor className="w-4 h-4 text-sky-600" />
                <span className="hidden lg:inline text-[11px]">Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-sky-600" />
                <span className="hidden lg:inline text-[11px]">Mobile</span>
              </>
            )}
          </button>

          {/* Saved Wishlist counter */}
          <button
            id="saved-wishlist-btn"
            onClick={() => setActiveTab('profile')}
            className="relative p-1.5 sm:p-2 rounded-xl bg-white border border-sky-200 text-slate-700 hover:text-sky-700 shadow-2xs transition-all"
            title="Saved Places"
          >
            <Bookmark className="w-4 h-4" />
            {savedWishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {savedWishlist.length}
              </span>
            )}
          </button>

          {/* Notification Bell */}
          <button
            id="notification-bell-btn"
            onClick={() => setActiveTab('profile')}
            className="relative p-1.5 sm:p-2 rounded-xl bg-white border border-sky-200 text-slate-700 hover:text-sky-700 shadow-2xs transition-all"
            title="Notifications & Bookings"
          >
            <Bell className="w-4 h-4" />
            {bookings.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {bookings.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export const FloatingBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'packages', label: 'Packages', icon: Compass },
    { id: 'umrah', label: 'Umrah', icon: Moon },
    { id: 'evisa', label: 'E-Visa', icon: FileCheck2 },
    { id: 'flights', label: 'Radar', icon: PlaneTakeoff },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto bg-[#051b34]/95 backdrop-blur-xl border border-sky-500/30 shadow-2xl rounded-full px-2 py-1.5 flex items-center gap-1 max-w-md w-full justify-between">
        {/* Main Tab Links */}
        <div className="flex items-center gap-1 flex-1 justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-md shadow-sky-600/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {isActive && <span className="text-[11px] font-bold">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* AI Travel Assistant Glowing Sparkle Button */}
        <button
          id="bottom-nav-ai-btn"
          onClick={() => setActiveTab('ai-planner')}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ml-1 ${
            activeTab === 'ai-planner'
              ? 'bg-gradient-to-tr from-sky-400 via-sky-300 to-cyan-200 text-[#051b34] shadow-lg shadow-sky-400/50 scale-105'
              : 'bg-gradient-to-tr from-sky-500 to-cyan-400 text-white hover:scale-105 shadow-md shadow-sky-500/30'
          }`}
          title="AI Gemini Travel Planner"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
        </button>
      </div>
    </div>
  );
};

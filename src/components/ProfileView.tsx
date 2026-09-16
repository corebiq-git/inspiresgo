import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Award, 
  Calendar, 
  FileCheck2, 
  Bookmark, 
  Settings, 
  LogOut, 
  QrCode, 
  Download, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Heart
} from 'lucide-react';
import { DESTINATIONS } from '../data/mockData';
import { BookingRecord } from '../types';

export const ProfileView: React.FC = () => {
  const { 
    user, 
    bookings, 
    visaApplications, 
    savedWishlist, 
    formatPrice, 
    loginWithFirebase, 
    logout,
    toggleSaveItem,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'visas' | 'saved' | 'settings'>('bookings');
  const [selectedTicket, setSelectedTicket] = useState<BookingRecord | null>(null);

  // Filter saved destinations
  const wishlistDestinations = DESTINATIONS.filter(d => savedWishlist.includes(d.id));

  return (
    <div className="space-y-6 pb-24">
      {/* Fathima Member Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#051b34] via-[#082a52] to-[#041529] text-white p-6 shadow-xl space-y-4 border border-sky-400/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={user.avatarUrl} 
                alt={user.fullName} 
                className="w-16 h-16 rounded-full object-cover ring-4 ring-sky-400/30 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-[#051b34] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black">{user.fullName}</h1>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ★ Gold Tier
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">{user.email}</p>
              <div className="text-[11px] text-sky-300 font-medium mt-1">
                Passport: {user.passportNumber} • {user.nationality}
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Points & Stats Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sky-700/60 text-center">
          <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm">
            <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5" /> 4,850 Pts
            </div>
            <div className="text-[10px] text-sky-100 mt-0.5">Worth $48.50</div>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm">
            <div className="text-xs font-bold text-white">
              {bookings.length} Trips
            </div>
            <div className="text-[10px] text-sky-100 mt-0.5">Booked</div>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm">
            <div className="text-xs font-bold text-emerald-300">
              {visaApplications.length} E-Visas
            </div>
            <div className="text-[10px] text-sky-100 mt-0.5">Active Passes</div>
          </div>
        </div>
      </div>

      {/* Profile Sub Navigation */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-sky-100 shadow-2xs overflow-x-auto no-scrollbar">
        <button
          id="profile-tab-bookings"
          onClick={() => setActiveSubTab('bookings')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'bookings'
              ? 'bg-[#051b34] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Bookings ({bookings.length})
        </button>

        <button
          id="profile-tab-visas"
          onClick={() => setActiveSubTab('visas')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'visas'
              ? 'bg-[#051b34] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          E-Visas ({visaApplications.length})
        </button>

        <button
          id="profile-tab-saved"
          onClick={() => setActiveSubTab('saved')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'saved'
              ? 'bg-[#051b34] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Saved ({savedWishlist.length})
        </button>

        <button
          id="profile-tab-settings"
          onClick={() => setActiveSubTab('settings')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'settings'
              ? 'bg-[#051b34] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Subtab 1: My Bookings */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No Trips Booked Yet</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our trending destinations, upcoming packages, or Umrah pilgrimages to get started.
              </p>
              <button
                onClick={() => setActiveTab('packages')}
                className="px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-md"
              >
                Browse Packages
              </button>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                id={`booking-card-${b.bookingRef}`}
                className="bg-white rounded-3xl p-5 border border-sky-100 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Booking Reference</span>
                    <div className="text-base font-black text-[#051b34]">{b.bookingRef}</div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase">
                    ● {b.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900">{b.title}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-600" /> {b.destination}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-sky-600" /> {b.travelersCount} Travelers
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Dates</span>
                    <span className="font-bold text-slate-800">{b.startDate} to {b.endDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">Total Amount</span>
                    <span className="font-black text-slate-900">{formatPrice(b.totalAmountUSD)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTicket(b)}
                    className="flex-1 py-2.5 rounded-xl bg-[#051b34] hover:bg-sky-950 text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" /> View Digital E-Ticket Pass
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab 2: E-Visas */}
      {activeSubTab === 'visas' && (
        <div className="space-y-4">
          {visaApplications.map((v) => (
            <div key={v.id} className="bg-white rounded-3xl p-5 border border-sky-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="text-xs text-slate-400">Ref: {v.referenceNo}</div>
                  <div className="text-sm font-black text-slate-900">{v.country} eVisa</div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                  {v.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Applicant</span>
                  <span className="font-bold text-slate-800">{v.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Passport</span>
                  <span className="font-bold text-slate-800">{v.passportNumber}</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Official E-Visa pass ${v.referenceNo} downloaded!`)}
                className="w-full py-2.5 rounded-xl border border-sky-200 text-sky-800 hover:bg-sky-50 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Approved eVisa PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 3: Saved Destinations */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          {wishlistDestinations.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center space-y-2 border border-slate-200">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No Saved Destinations Yet</div>
              <p className="text-xs text-slate-500">Tap the heart icon on any destination card to bookmark it.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {wishlistDestinations.map((d) => (
                <div key={d.id} className="bg-white rounded-2xl overflow-hidden border border-teal-100 shadow-sm flex flex-col">
                  <div className="relative h-36 w-full">
                    <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleSaveItem(d.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{d.name}</h4>
                      <p className="text-[11px] text-slate-500">{d.location}</p>
                    </div>
                    <div className="text-xs font-extrabold text-teal-800 mt-2">
                      {formatPrice(d.pricePerPerson)} / person
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subtab 4: Settings & Firebase Auth */}
      {activeSubTab === 'settings' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-100 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900">
            Account & Security Settings
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <div className="font-bold text-slate-800">Cloud Data Sync</div>
                <div className="text-slate-500 text-[11px]">Syncs your bookings & e-visas with Firebase Firestore</div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <div className="font-bold text-slate-800">Flight Radar SMS Alerts</div>
                <div className="text-slate-500 text-[11px]">Real-time gate and delay updates to phone</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-sky-600 focus:ring-sky-500" />
            </div>

            {/* Direct Link to Head Office & Branch Contacts */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/70 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-[#051b34] text-xs">InspireGo Support & Offices</div>
                <div className="text-[11px] text-slate-600">UAE Head Office & India Branch Contact Details</div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('home');
                  setTimeout(() => {
                    document.getElementById('offices-contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#051b34] text-white font-bold text-[11px] hover:bg-sky-950 transition-all"
              >
                View Offices
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => loginWithFirebase('fathima@inspirego.travel', 'password123')}
              className="flex-1 py-2.5 rounded-xl border border-sky-200 text-sky-800 hover:bg-sky-50 text-xs font-bold"
            >
              Simulate Firebase Auth
            </button>
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 text-xs font-bold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      )}

      {/* Digital E-Ticket Pass Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-sky-100 space-y-5 animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-50 text-sky-800 px-3 py-1 rounded-full border border-sky-200">
                Official Digital Travel Voucher
              </span>
              <h3 className="text-lg font-black text-slate-900 pt-1">
                {selectedTicket.title}
              </h3>
              <div className="text-xs text-slate-500">Ref: {selectedTicket.bookingRef}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
              <QrCode className="w-32 h-32 text-[#051b34]" />
              <span className="text-[10px] font-mono font-bold text-slate-500">
                AUTH: {selectedTicket.bookingRef}-PASS-OK
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Guest</span>
                <span className="font-bold text-slate-900">{user.fullName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Departure Date</span>
                <span className="font-bold text-slate-900">{selectedTicket.startDate}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment</span>
                <span className="font-bold text-emerald-700">PAID IN FULL ({formatPrice(selectedTicket.totalAmountUSD)})</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#051b34] text-white text-xs font-bold shadow-md hover:bg-sky-950"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

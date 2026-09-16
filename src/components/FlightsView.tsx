import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_FLIGHTS } from '../data/mockData';
import { 
  PlaneTakeoff, 
  PlaneLanding, 
  Search, 
  Clock, 
  MapPin, 
  Gauge, 
  Wind, 
  Compass, 
  Bell, 
  BellRing, 
  Check, 
  CloudSun, 
  Luggage,
  ShieldCheck
} from 'lucide-react';
import { FlightInfo } from '../types';

export const FlightsView: React.FC = () => {
  const [flights, setFlights] = useState<FlightInfo[]>(INITIAL_FLIGHTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<FlightInfo>(INITIAL_FLIGHTS[0]);
  const [subscribedFlight, setSubscribedFlight] = useState<string | null>('EK202');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch live flights from server API
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const res = await fetch(`/api/flights?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data?.flights && data.flights.length > 0) {
        setFlights(data.flights);
        setSelectedFlight(data.flights[0]);
      }
    } catch {
      // Filter locally
      const filtered = INITIAL_FLIGHTS.filter(f => 
        f.flightNumber.toLowerCase().includes(query.toLowerCase()) ||
        f.origin.city.toLowerCase().includes(query.toLowerCase()) ||
        f.destination.city.toLowerCase().includes(query.toLowerCase())
      );
      if (filtered.length > 0) {
        setFlights(filtered);
        setSelectedFlight(filtered[0]);
      }
    }
  };

  const toggleAlert = (flightNo: string) => {
    if (subscribedFlight === flightNo) {
      setSubscribedFlight(null);
    } else {
      setSubscribedFlight(flightNo);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200/60">
          <PlaneTakeoff className="w-3.5 h-3.5" /> Live Global Flight Radar & Telemetry
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Real-Time Flight Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Live altitude, ground speed, gate departures, baggage carousels, and arrival weather.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          id="flight-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search flight code (e.g. EK202, SV101, QR777, AI101) or city..."
          className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-sky-100 shadow-2xs text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 uppercase"
        />
        <Search className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
      </div>

      {/* Primary Flight Telemetry Radar Card */}
      {selectedFlight && (
        <div className="bg-gradient-to-br from-[#051b34] via-[#082342] to-[#041527] rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-6 border border-sky-500/20 relative overflow-hidden">
          {/* Top Status & Airline */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600/30 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-sm">
                ✈
              </div>
              <div>
                <div className="text-base sm:text-lg font-black tracking-wide text-white">
                  {selectedFlight.airline} {selectedFlight.flightNumber}
                </div>
                <div className="text-xs text-slate-400">
                  {selectedFlight.aircraft}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${
                selectedFlight.status === 'In Air'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                  : selectedFlight.status === 'Boarding'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                ● {selectedFlight.status}
              </span>

              <button
                id="flight-alert-toggle-btn"
                onClick={() => toggleAlert(selectedFlight.flightNumber)}
                className={`p-2 rounded-xl transition-all ${
                  subscribedFlight === selectedFlight.flightNumber
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Subscribe to Live Flight SMS & Push Alerts"
              >
                {subscribedFlight === selectedFlight.flightNumber ? (
                  <BellRing className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Route Progress Visualizer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {selectedFlight.origin.code}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {selectedFlight.origin.city}
                </div>
                <div className="text-xs text-sky-300 font-bold mt-0.5">
                  {selectedFlight.origin.departureTime}
                </div>
              </div>

              {/* Trajectory Bar */}
              <div className="flex-1 mx-4 sm:mx-8 relative flex flex-col items-center">
                <div className="w-full h-1 bg-slate-800 rounded-full relative">
                  <div 
                    className="h-1 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-700" 
                    style={{ width: `${selectedFlight.progressPercent}%` }}
                  />
                  <div 
                    className="absolute -top-3 w-7 h-7 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-lg transition-all duration-700 -ml-3.5"
                    style={{ left: `${selectedFlight.progressPercent}%` }}
                  >
                    <PlaneTakeoff className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold mt-3">
                  {selectedFlight.progressPercent}% Route Completed
                </span>
              </div>

              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {selectedFlight.destination.code}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {selectedFlight.destination.city}
                </div>
                <div className="text-xs text-sky-300 font-bold mt-0.5">
                  {selectedFlight.destination.arrivalTime}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-cyan-400" /> Altitude
              </div>
              <div className="text-sm font-extrabold text-white mt-1">
                {selectedFlight.altitude}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Wind className="w-3 h-3 text-cyan-400" /> Ground Speed
              </div>
              <div className="text-sm font-extrabold text-white mt-1">
                {selectedFlight.groundSpeed}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <CloudSun className="w-3 h-3 text-amber-400" /> Dest. Weather
              </div>
              <div className="text-sm font-extrabold text-white mt-1">
                {selectedFlight.destination.weather}
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Luggage className="w-3 h-3 text-emerald-400" /> Baggage Belt
              </div>
              <div className="text-sm font-extrabold text-white mt-1">
                {selectedFlight.destination.baggageCarousel}
              </div>
            </div>
          </div>

          {/* Airport Terminal & Gate Details */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800/80">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Departure Terminal</span>
              <div className="font-bold text-white mt-0.5">
                {selectedFlight.origin.airport} ({selectedFlight.origin.terminal}, Gate {selectedFlight.origin.gate})
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Arrival Terminal</span>
              <div className="font-bold text-white mt-0.5">
                {selectedFlight.destination.airport} ({selectedFlight.destination.terminal}, Gate {selectedFlight.destination.gate})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flight Roster Selector */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900">
          Popular Live Flight Routes
        </h3>

        <div className="space-y-2.5">
          {flights.map((f) => (
            <div
              key={f.flightNumber}
              id={`flight-card-${f.flightNumber}`}
              onClick={() => setSelectedFlight(f)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedFlight?.flightNumber === f.flightNumber
                  ? 'bg-white border-sky-600 ring-2 ring-sky-600/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center font-bold text-xs">
                  {f.origin.code}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>{f.airline} {f.flightNumber}</span>
                    <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-semibold">
                      {f.aircraft}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {f.origin.city} ({f.origin.departureTime}) → {f.destination.city} ({f.destination.arrivalTime})
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  f.status === 'In Air' ? 'bg-cyan-50 text-cyan-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {f.status}
                </span>
                <div className="text-[10px] text-slate-400 mt-1">
                  Gate {f.origin.gate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

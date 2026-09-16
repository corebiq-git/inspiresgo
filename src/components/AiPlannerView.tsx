import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Send, 
  Calendar, 
  MapPin, 
  Clock, 
  Compass, 
  Utensils, 
  Luggage, 
  Info, 
  Check, 
  ArrowRight,
  Bookmark,
  Share2,
  RefreshCw
} from 'lucide-react';

interface ItineraryDay {
  dayNumber: number;
  title: string;
  theme: string;
  morning: { time: string; title: string; description: string; tip: string };
  afternoon: { time: string; title: string; description: string; tip: string };
  evening: { time: string; title: string; description: string; tip: string };
  dayBudgetEstimate?: string;
}

interface ItineraryResult {
  title: string;
  tagline: string;
  overview: string;
  destination: string;
  durationDays: number;
  estimatedBudget: string;
  bestTimeToVisit: string;
  curatedHighlights: string[];
  days: ItineraryDay[];
  localFoodToTry?: { name: string; description: string; mustTrySpot: string }[];
  packingEssentials?: string[];
  culturalTips?: string[];
}

export const AiPlannerView: React.FC = () => {
  const { startBookingFlow, formatPrice } = useApp();

  const [destination, setDestination] = useState('Banff National Park, Canada');
  const [durationDays, setDurationDays] = useState(5);
  const [budget, setBudget] = useState('Moderate');
  const [travelerType, setTravelerType] = useState('Couple');
  const [travelStyle, setTravelStyle] = useState('Scenic Nature & Lakes');
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResult | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const quickPrompts = [
    { label: '🏔️ Banff 5-Day Lakes & Peaks', dest: 'Banff National Park, Canada', days: 5, style: 'Scenic Nature & Lakes' },
    { label: '🕋 Sacred 7-Day Umrah & Madinah', dest: 'Makkah & Madinah, Saudi Arabia', days: 7, style: 'Spiritual Pilgrimage' },
    { label: '🌸 Kyoto Zen & Culinary Escape', dest: 'Kyoto, Japan', days: 6, style: 'Cultural & Culinary' },
    { label: '🚡 Swiss Alpine Rail Tour', dest: 'Interlaken & Lucerne, Switzerland', days: 6, style: 'Alpine Panoramic Adventure' }
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setItinerary(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          durationDays,
          budget,
          travelerType,
          travelStyle,
          customPrompt
        })
      });
      const data = await res.json();
      if (data?.itinerary) {
        setItinerary(data.itinerary);
        setActiveDayIndex(0);
      }
    } catch (err) {
      console.error('Itinerary error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookGeneratedTrip = () => {
    if (!itinerary) return;
    startBookingFlow({
      itemType: 'package',
      itemId: `ai-trip-${Date.now()}`,
      title: itinerary.title,
      destination: itinerary.destination || destination,
      startDate: '2026-07-10',
      endDate: '2026-07-17',
      travelersCount: 2,
      totalAmountUSD: budget === 'Luxury' ? 3200 : 1650
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200/60">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Powered by Gemini AI
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#051b34] tracking-tight">
          Personalized Itinerary Architect
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Describe your dream journey. Gemini creates day-by-day schedules with timings, local food, and cost estimations.
        </p>
      </div>

      {/* Quick Prompt Carousel */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Try Quick Itinerary Inspirations
        </span>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              id={`quick-ai-prompt-${idx}`}
              onClick={() => {
                setDestination(p.dest);
                setDurationDays(p.days);
                setTravelStyle(p.style);
              }}
              className="flex-shrink-0 px-3 py-2 bg-white rounded-xl border border-sky-100 text-xs font-bold text-slate-700 hover:border-sky-400 shadow-2xs transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customizer Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-100 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Destination */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Where do you want to travel?
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Banff National Park, Makkah, Kyoto, Amalfi Coast"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
                required
              />
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Duration: <span className="text-sky-700 font-black">{durationDays} Days</span>
            </label>
            <input
              type="range"
              min="2"
              max="14"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
              <span>2 Days (Weekend)</span>
              <span>7 Days (Week)</span>
              <span>14 Days (Extended)</span>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Budget Tier
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
            >
              <option value="Economy">Economy ($ - Smart Value)</option>
              <option value="Moderate">Moderate ($$ - Balanced Comfort)</option>
              <option value="Luxury">Luxury ($$$ - 5★ Stays & Private)</option>
            </select>
          </div>

          {/* Travelers Type */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Companions
            </label>
            <select
              value={travelerType}
              onChange={(e) => setTravelerType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
            >
              <option value="Solo Traveler">Solo Explorer</option>
              <option value="Couple">Romantic Couple</option>
              <option value="Family with Kids">Family with Children</option>
              <option value="Group of Friends">Friends Traveling Together</option>
            </select>
          </div>

          {/* Travel Style */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Primary Vibe & Style
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
            >
              <option value="Scenic Nature & Lakes">Scenic Nature & Lakes</option>
              <option value="Spiritual Pilgrimage">Spiritual & Devotional</option>
              <option value="Cultural Heritage & History">Cultural Heritage & History</option>
              <option value="Culinary & Street Food">Culinary & Local Gastronomy</option>
              <option value="Adrenaline & Outdoor Adventure">Adrenaline & Outdoor Adventure</option>
              <option value="Relaxation & Wellness">Relaxation, Spas & Wellness</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          id="generate-itinerary-btn"
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#051b34] hover:bg-sky-950 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Gemini AI is crafting your bespoke itinerary...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Personalized Itinerary</span>
            </>
          )}
        </button>
      </form>

      {/* Generated Itinerary Display */}
      {itinerary && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-100 shadow-lg space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-50 text-sky-800 px-3 py-1 rounded-full border border-sky-200">
                {itinerary.durationDays} Days • {itinerary.estimatedBudget}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSavedSuccess(true)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-sky-700 hover:border-sky-300 transition-all flex items-center gap-1 text-xs font-semibold"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${savedSuccess ? 'fill-sky-700 text-sky-700' : ''}`} />
                  <span>{savedSuccess ? 'Saved!' : 'Save Plan'}</span>
                </button>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#051b34] leading-tight">
              {itinerary.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {itinerary.overview}
            </p>

            <div className="text-xs text-sky-800 font-semibold flex items-center gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5" /> Best Time to Visit: {itinerary.bestTimeToVisit}
            </div>
          </div>

          {/* Highlights List */}
          {itinerary.curatedHighlights && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Curated Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {itinerary.curatedHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2 bg-sky-50/60 p-2.5 rounded-xl border border-sky-100/50 text-xs text-slate-800">
                    <Check className="w-3.5 h-3.5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day Selector Pills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daily Schedule Breakdown
            </h4>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {itinerary.days.map((d, idx) => (
                <button
                  key={d.dayNumber}
                  id={`itinerary-day-tab-${d.dayNumber}`}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeDayIndex === idx
                      ? 'bg-[#051b34] text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Day {d.dayNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Active Day Card */}
          {itinerary.days[activeDayIndex] && (() => {
            const day = itinerary.days[activeDayIndex];
            return (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-sky-700">
                      Day {day.dayNumber} Theme
                    </span>
                    <h3 className="text-base font-black text-slate-900">
                      {day.title}
                    </h3>
                  </div>
                  {day.dayBudgetEstimate && (
                    <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                      Est. {day.dayBudgetEstimate}
                    </span>
                  )}
                </div>

                {/* Morning, Afternoon, Evening Cards */}
                <div className="space-y-3">
                  {/* Morning */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                        🌅 Morning ({day.morning.time})
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{day.morning.title}</div>
                    <p className="text-xs text-slate-600">{day.morning.description}</p>
                    {day.morning.tip && (
                      <div className="text-[11px] text-sky-900 font-medium bg-sky-50/70 p-1.5 rounded-lg mt-1">
                        💡 Tip: {day.morning.tip}
                      </div>
                    )}
                  </div>

                  {/* Afternoon */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-700 flex items-center gap-1">
                        ☀️ Afternoon ({day.afternoon.time})
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{day.afternoon.title}</div>
                    <p className="text-xs text-slate-600">{day.afternoon.description}</p>
                    {day.afternoon.tip && (
                      <div className="text-[11px] text-sky-900 font-medium bg-sky-50/70 p-1.5 rounded-lg mt-1">
                        💡 Tip: {day.afternoon.tip}
                      </div>
                    )}
                  </div>

                  {/* Evening */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                        🌙 Evening ({day.evening.time})
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{day.evening.title}</div>
                    <p className="text-xs text-slate-600">{day.evening.description}</p>
                    {day.evening.tip && (
                      <div className="text-[11px] text-sky-900 font-medium bg-sky-50/70 p-1.5 rounded-lg mt-1">
                        💡 Tip: {day.evening.tip}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Local Foods & Packing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {itinerary.localFoodToTry && (
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5" /> Must-Try Culinary Flavors
                </h4>
                <div className="space-y-2">
                  {itinerary.localFoodToTry.map((food, i) => (
                    <div key={i} className="text-xs">
                      <div className="font-bold text-slate-900">{food.name}</div>
                      <div className="text-[11px] text-slate-600">{food.description}</div>
                      <div className="text-[10px] text-amber-800 font-semibold mt-0.5">
                        📍 Recommended spot: {food.mustTrySpot}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {itinerary.packingEssentials && (
              <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 space-y-2">
                <h4 className="text-xs font-bold text-sky-900 uppercase flex items-center gap-1">
                  <Luggage className="w-3.5 h-3.5" /> Packing Essentials
                </h4>
                <div className="space-y-1">
                  {itinerary.packingEssentials.map((item, i) => (
                    <div key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-sky-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Ready to turn this itinerary into reality?
              </div>
              <div className="text-[11px] text-slate-600">
                Book flights, hotels, and airport transfers for this custom trip in one checkout.
              </div>
            </div>

            <button
              id="book-custom-ai-itinerary-btn"
              onClick={handleBookGeneratedTrip}
              className="py-3 px-6 rounded-2xl bg-[#051b34] hover:bg-sky-950 text-white font-bold text-xs shadow-md flex items-center gap-2 whitespace-nowrap transition-all"
            >
              Book This Custom Journey <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

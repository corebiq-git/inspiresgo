import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Plane, ArrowRight, ShieldCheck, Sparkles, MapPin, Check } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!showOnboarding) return null;

  const steps = [
    {
      type: 'splash',
      title: 'Smart Guide',
      subtitle: 'The digital guide platform',
      description: 'Your intelligent companion for effortless discovery, curated tour packages, sacred Umrah pilgrimages, and instant e-visas.'
    },
    {
      type: 'guide',
      title: 'Start Your Journey Today with Smart Guide',
      tag: 'Plan Better Trips with Smart Guidance',
      description: 'Explore trending wonders, compare verified packages, and let AI craft personalized day-by-day itineraries tailored to your style.',
      badges: ['Curated Destinations', 'Verified Stays', 'Direct Booking']
    },
    {
      type: 'features',
      title: 'All-in-One Travel Intelligence',
      tag: 'Designed for the Modern Traveler',
      description: 'Real-time flight telemetry radar, seamless UPI and card payments, fast e-visa approvals, and 24/7 live concierge care.',
      badges: ['Real-Time Radar', 'Instant UPI & Card', 'E-Visa Hub', '24/7 AI Concierge']
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const current = steps[currentStep];

  return (
    <div id="onboarding-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div 
        id="onboarding-card"
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-teal-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
        style={{ maxHeight: '90vh' }}
      >
        {/* Top bar with skip */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#051b34] flex items-center justify-center text-sky-400 shadow-2xs">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-[#051b34]">InspireGO</span>
          </div>

          <button
            id="onboarding-skip-btn"
            onClick={() => setShowOnboarding(false)}
            className="text-xs font-semibold text-slate-400 hover:text-sky-700 px-2 py-1 transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Visual Showcase Graphic Area */}
        <div className="relative px-6 py-6 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sky-50/70 to-white">
          {currentStep === 0 && (
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Soft decorative background circles */}
              <div className="absolute inset-0 rounded-full bg-sky-100/60 animate-pulse" />
              <div className="absolute w-36 h-36 rounded-full bg-sky-200/40" />

              {/* Vector Globe & Airplane composition */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#051b34] to-sky-700 flex items-center justify-center text-white shadow-xl shadow-sky-900/20">
                  <Compass className="w-12 h-12 text-sky-300 animate-spin-slow" />
                </div>
                <div className="absolute -top-1 -right-2 bg-white p-2 rounded-full shadow-md text-sky-600">
                  <Plane className="w-5 h-5 -rotate-45" />
                </div>
                <div className="absolute -bottom-2 -left-2 bg-white px-2.5 py-1 rounded-full shadow-md text-[11px] font-bold text-[#051b34] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Smart Guide
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="relative w-full max-w-[280px] h-48 flex items-center justify-center">
              <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-lg border border-sky-100">
                <img 
                  src="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80" 
                  alt="Destinations"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-300">
                    <MapPin className="w-3 h-3" /> Banff, Canada
                  </div>
                  <div className="text-sm font-bold">Turquoise Waters & Peaks</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="w-full max-w-[280px] h-48 grid grid-cols-2 gap-2.5 items-center">
              <div className="bg-gradient-to-br from-[#051b34] to-sky-900 p-3.5 rounded-2xl text-white shadow-md">
                <div className="text-amber-300 mb-1">🕋</div>
                <div className="text-xs font-bold leading-snug">Umrah Services</div>
                <div className="text-[10px] text-sky-200 mt-0.5">5★ Haram Hotels</div>
              </div>
              <div className="bg-gradient-to-br from-sky-800 to-cyan-900 p-3.5 rounded-2xl text-white shadow-md">
                <div className="text-sky-200 mb-1">🛂</div>
                <div className="text-xs font-bold leading-snug">E-Visa Portal</div>
                <div className="text-[10px] text-sky-200 mt-0.5">24h Fast Track</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-800 to-sky-950 p-3.5 rounded-2xl text-white shadow-md">
                <div className="text-cyan-200 mb-1">✈️</div>
                <div className="text-xs font-bold leading-snug">Live Radar</div>
                <div className="text-[10px] text-cyan-200 mt-0.5">Real-time Telemetry</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900 to-[#051b34] p-3.5 rounded-2xl text-white shadow-md">
                <div className="text-sky-300 mb-1">💳</div>
                <div className="text-xs font-bold leading-snug">UPI & Cards</div>
                <div className="text-[10px] text-sky-200 mt-0.5">Instant Checkout</div>
              </div>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="px-6 py-4 flex-1 flex flex-col justify-between">
          <div className="text-center space-y-2">
            {'tag' in current && (
              <span className="inline-block px-3 py-1 bg-sky-50 text-sky-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
                {current.tag}
              </span>
            )}
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
              {current.description}
            </p>

            {'badges' in current && current.badges && (
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {current.badges.map((b, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3 h-3 text-sky-600" />
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stepper Dots & Action Button */}
          <div className="pt-6 pb-2 space-y-4">
            <div className="flex justify-center items-center gap-1.5">
              {steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStep ? 'w-8 bg-[#051b34]' : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <button
              id="onboarding-next-btn"
              onClick={handleNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#051b34] hover:bg-sky-950 active:scale-[0.99] text-white font-bold text-sm shadow-md flex items-center justify-between transition-all"
            >
              <div className="w-6" />
              <span className="tracking-wide">
                {currentStep === steps.length - 1 ? 'Get Started' : 'Get Start'}
              </span>
              <div className="flex items-center text-sky-300">
                <ArrowRight className="w-4 h-4" />
                <ArrowRight className="w-4 h-4 -ml-2" />
                <ArrowRight className="w-4 h-4 -ml-2 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Compass, Download, X } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If already installed or dismissed
    const dismissed = localStorage.getItem('inspirego_pwa_dismissed');
    if (!dismissed) {
      // Show subtle banner on mobile/tablet after 4 seconds
      const timer = setTimeout(() => {
        if (!window.matchMedia('(display-mode: standalone)').matches) {
          setShowBanner(true);
        }
      }, 3500);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install InspireGO on your device: Tap Share / Options in your browser and select "Add to Home Screen".');
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('inspirego_pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-teal-800/50 shadow-sm relative z-30">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-lg bg-teal-600 flex items-center justify-center text-white">
          <Compass className="w-3.5 h-3.5" />
        </div>
        <div className="leading-tight">
          <span className="font-bold text-white">Install InspireGO App</span>
          <span className="text-teal-200 ml-1 hidden sm:inline">• Fast offline access & flight alerts</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          id="pwa-install-btn"
          onClick={handleInstall}
          className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 shadow-sm transition-all"
        >
          <Download className="w-3 h-3" /> Install
        </button>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopHeader, FloatingBottomNav } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { PackagesView } from './components/PackagesView';
import { UmrahView } from './components/UmrahView';
import { EVisaView } from './components/EVisaView';
import { FlightsView } from './components/FlightsView';
import { AiPlannerView } from './components/AiPlannerView';
import { ProfileView } from './components/ProfileView';
import { OnboardingModal } from './components/OnboardingModal';
import { PaymentModal } from './components/PaymentModal';
import { ChatSupportModal } from './components/ChatSupportModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';

const MainAppLayout: React.FC = () => {
  const { activeTab, viewMode } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'packages':
        return <PackagesView />;
      case 'umrah':
        return <UmrahView />;
      case 'evisa':
        return <EVisaView />;
      case 'flights':
        return <FlightsView />;
      case 'ai-planner':
        return <AiPlannerView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 antialiased font-sans flex flex-col items-center">
      {/* PWA Install Banner */}
      <div className="w-full">
        <PwaInstallBanner />
      </div>

      {/* Outer wrapper: Mobile frame simulation vs Fluid full layout */}
      <div className={`w-full flex-1 flex flex-col transition-all duration-300 ${
        viewMode === 'mobile'
          ? 'max-w-md my-0 sm:my-6 rounded-none sm:rounded-[40px] shadow-none sm:shadow-2xl border-0 sm:border-8 sm:border-slate-800/80 bg-slate-50 overflow-hidden relative'
          : 'max-w-4xl bg-slate-50/80'
      }`}>
        {/* Top Header */}
        <TopHeader />

        {/* Dynamic Main Body */}
        <main className="flex-1 px-4 py-4 sm:px-6 overflow-y-auto">
          {renderActiveTab()}
        </main>

        {/* Floating Bottom Nav Pill */}
        <FloatingBottomNav />
      </div>

      {/* Floating Global Modals & Drawers */}
      <OnboardingModal />
      <PaymentModal />
      <ChatSupportModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}

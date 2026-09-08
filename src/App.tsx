/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, AgentListing, UserAssessment } from './types';
import { INITIAL_AGENT_LISTINGS } from './data/marketplaceData';
import { ScreenChatbot } from './components/ScreenChatbot';
import { ScreenMarketplace } from './components/ScreenMarketplace';
import { ScreenIndustryExplorer } from './components/ScreenIndustryExplorer';
import { PhoneHeader } from './components/PhoneHeader';
import { PhoneBottomNav } from './components/PhoneBottomNav';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function App() {
  // Screen navigation state without page reload
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('chatbot');

  // Marketplace listings state initialized with invented data (at least 10 rows)
  const [listings, setListings] = useState<AgentListing[]>(INITIAL_AGENT_LISTINGS);

  // User assessment from chatbot guide (Screen 1)
  const [userAssessment, setUserAssessment] = useState<UserAssessment>({
    userType: null,
    softwareInterest: '',
    industry: '',
    role: '',
    problemStatement: '',
    desiredOutcome: '',
  });

  // Desktop phone frame mode toggle
  const [isDesktopFrame, setIsDesktopFrame] = useState(true);

  // Add new agent listing handler (Seller form)
  const handleAddListing = (newListing: AgentListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const handleAssessmentComplete = (assessment: UserAssessment) => {
    setUserAssessment(assessment);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center sm:p-4 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Phone container: Full screen on mobile, phone frame on desktop */}
      <div
        className={`w-full h-screen sm:h-[92vh] flex flex-col bg-slate-900 overflow-hidden shadow-2xl transition-all duration-300 ${
          isDesktopFrame
            ? 'sm:max-w-[430px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700/60 relative'
            : 'max-w-4xl sm:rounded-2xl sm:border border-slate-800'
        }`}
      >
        {/* Phone Speaker & Dynamic Notch (Visible on desktop frame) */}
        {isDesktopFrame && (
          <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 text-[12px] text-slate-400 select-none bg-slate-900 shrink-0">
            <span className="font-semibold text-slate-300">09:41</span>
            {/* Camera Pill */}
            <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-950"></div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Global Phone Header */}
        <PhoneHeader
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          isDesktopFrame={isDesktopFrame}
          onToggleFrame={() => setIsDesktopFrame((prev) => !prev)}
        />

        {/* Screen View Area (Without reloading page) */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {currentScreen === 'chatbot' && (
            <ScreenChatbot
              onNavigate={setCurrentScreen}
              onAssessmentComplete={handleAssessmentComplete}
              currentAssessment={userAssessment}
            />
          )}

          {currentScreen === 'marketplace' && (
            <ScreenMarketplace
              listings={listings}
              onAddListing={handleAddListing}
              selectedIndustryFilter={userAssessment.industry}
            />
          )}

          {currentScreen === 'explorer' && (
            <ScreenIndustryExplorer
              listings={listings}
              onNavigate={setCurrentScreen}
              userRole={userAssessment.role}
              userIndustry={userAssessment.industry}
            />
          )}
        </main>

        {/* Global Fixed Phone Bottom Navigation Bar */}
        <PhoneBottomNav
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          listingsCount={listings.length}
        />
      </div>

      {/* Arm's length reminder footer note for SMU class presentation */}
      <footer className="hidden sm:block mt-3 text-center text-xs text-slate-500">
        GEEK AI Mobile Prototype • MGMT 6110 Week 3 • Designed for phone readability at arm's length
      </footer>
    </div>
  );
}

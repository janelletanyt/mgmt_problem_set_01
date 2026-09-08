import React from 'react';
import { Bot, Store, Compass } from 'lucide-react';
import { ScreenType } from '../types';

interface PhoneHeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const PhoneHeader: React.FC<PhoneHeaderProps> = ({
  currentScreen,
  onNavigate,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
          G
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-extrabold tracking-tight text-white">GEEK AI</h1>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              SMU MGMT 6110
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Agentic Enterprise Marketplace</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-750">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] text-slate-300 font-medium">Week 3</span>
        </div>
      </div>
    </header>
  );
};

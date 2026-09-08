import React from 'react';
import { Bot, Store, Compass } from 'lucide-react';
import { ScreenType } from '../types';

interface PhoneBottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  listingsCount: number;
}

export const PhoneBottomNav: React.FC<PhoneBottomNavProps> = ({
  currentScreen,
  onNavigate,
  listingsCount,
}) => {
  const navItems = [
    {
      id: 'chatbot' as ScreenType,
      label: '1. Chatbot Guide',
      subtitle: 'Intent Profiler',
      icon: Bot,
      btnId: 'nav-btn-chatbot',
    },
    {
      id: 'marketplace' as ScreenType,
      label: '2. Marketplace',
      subtitle: 'Software & Hardware',
      icon: Store,
      badge: listingsCount,
      btnId: 'nav-btn-marketplace',
    },
    {
      id: 'explorer' as ScreenType,
      label: '3. Explore',
      subtitle: 'Industry Solutions',
      icon: Compass,
      btnId: 'nav-btn-explorer',
    },
  ];

  return (
    <nav className="bg-slate-900 border-t border-slate-800 px-2 py-1.5 shrink-0 z-30 select-none shadow-2xl">
      <div className="grid grid-cols-3 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              id={item.btnId}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer relative ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {item.label}
              </span>
              <span className="text-[9px] text-slate-400 hidden xs:inline">{item.subtitle}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

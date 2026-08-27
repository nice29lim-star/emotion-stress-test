import React from 'react';
import { CloudSun, History, Wind, ShieldAlert, HeartHandshake } from 'lucide-react';

interface HeaderProps {
  currentTab: 'assessment' | 'history' | 'breathing';
  onSelectTab: (tab: 'assessment' | 'history' | 'breathing') => void;
  onOpenHotline: () => void;
  savedLogsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenHotline,
  savedLogsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/60 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Logo */}
        <button
          id="btn-header-logo"
          onClick={() => onSelectTab('assessment')}
          className="flex items-center gap-2.5 sm:gap-3 text-left group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-600/10 text-teal-700 flex items-center justify-center border border-teal-600/20 shadow-sm group-hover:bg-teal-600/15 transition-colors">
            <CloudSun className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-900 tracking-tight text-base sm:text-lg">
                MindTracker
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 font-medium">
                Inner Weather
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              마음 날씨 진단 & 멘탈 케어
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="btn-nav-assessment"
            onClick={() => onSelectTab('assessment')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'assessment'
                ? 'bg-stone-900 text-stone-50 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span>마음 진단</span>
          </button>

          <button
            id="btn-nav-history"
            onClick={() => onSelectTab('history')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 relative ${
              currentTab === 'history'
                ? 'bg-stone-900 text-stone-50 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <History className="w-4 h-4" />
            <span>웰니스 기록장</span>
            {savedLogsCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                currentTab === 'history' ? 'bg-teal-500 text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                {savedLogsCount}
              </span>
            )}
          </button>

          <button
            id="btn-nav-breathing"
            onClick={() => onSelectTab('breathing')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'breathing'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-teal-700 hover:bg-teal-50'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span className="hidden sm:inline">3분 안심 호흡</span>
            <span className="sm:hidden">호흡</span>
          </button>

          <button
            id="btn-open-hotline"
            onClick={onOpenHotline}
            title="마음 긴급 지원 센터 안내"
            className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
          >
            <HeartHandshake className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
};

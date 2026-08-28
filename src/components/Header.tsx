import React from 'react';
import { CloudSun, History, Wind, HeartHandshake, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: 'assessment' | 'breathing';
  onSelectTab: (tab: 'assessment' | 'breathing') => void;
  onOpenHotline: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenHotline,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF5]/95 backdrop-blur-md border-b-2 border-[#1E293B] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        {/* Logo with Memphis Sticker feel */}
        <button
          id="btn-header-logo"
          onClick={() => onSelectTab('assessment')}
          className="flex items-center gap-3 text-left group transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center border-2 border-[#1E293B] shadow-pop-sm group-hover:-rotate-3 group-hover:scale-105 transition-all">
            <CloudSun className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-[#1E293B] tracking-tight text-lg sm:text-xl">
                MindTracker
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] font-bold shadow-[2px_2px_0px_#1E293B]">
                Inner Weather
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              마음 날씨 진단 & AI 멘탈 케어
            </p>
          </div>
        </button>

        {/* Navigation Tabs (Candy & Pill Buttons) */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-nav-assessment"
            onClick={() => onSelectTab('assessment')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-heading font-extrabold border-2 border-[#1E293B] transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'assessment'
                ? 'bg-[#8B5CF6] text-white shadow-pop-sm'
                : 'bg-white text-[#1E293B] hover:bg-[#F1F5F9] shadow-none hover:shadow-pop-sm'
            }`}
          >
            <CloudSun className="w-4 h-4 stroke-[2.5]" />
            <span>마음 진단</span>
          </button>

          <button
            id="btn-nav-breathing"
            onClick={() => onSelectTab('breathing')}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-heading font-extrabold border-2 border-[#1E293B] bg-white hover:bg-[#34D399] text-[#1E293B] hover:text-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Wind className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">3분 안심 호흡</span>
            <span className="sm:hidden">호흡</span>
          </button>

          <button
            id="btn-open-hotline"
            onClick={onOpenHotline}
            title="마음 긴급 지원 센터 안내"
            className="w-10 h-10 rounded-full bg-white hover:bg-[#F472B6] hover:text-white text-[#1E293B] border-2 border-[#1E293B] flex items-center justify-center transition-all shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ml-1"
          >
            <HeartHandshake className="w-4 h-4 stroke-[2.5]" />
          </button>
        </nav>
      </div>
    </header>
  );
};


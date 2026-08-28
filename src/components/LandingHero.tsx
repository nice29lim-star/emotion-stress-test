import React from 'react';
import { ArrowRight, CloudRain, Sun, Activity } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStart,
}) => {
  return (
    <div className="relative w-full max-w-5xl mx-auto py-10 sm:py-16 px-4 sm:px-6 overflow-hidden">
      {/* Wild Background Geometric Decos */}
      <div className="absolute top-12 left-6 w-20 h-20 rounded-full bg-[#FBBF24]/30 border-2 border-[#1E293B]/20 pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-28 right-10 w-16 h-16 rounded-3xl bg-[#F472B6]/25 border-2 border-[#1E293B]/20 rotate-12 pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-12 w-14 h-14 bg-[#34D399]/25 border-2 border-[#1E293B]/20 rotate-45 pointer-events-none -z-10" />

      {/* Main Title & Warm Comfort Copy */}
      <div className="text-center space-y-4 max-w-3xl mx-auto relative pt-4">
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1E293B] leading-[1.2]">
          오늘 하루, 당신의 <br className="hidden sm:inline" />
          <span className="relative inline-block px-3 py-1 my-1">
            <span className="absolute inset-0 bg-[#FBBF24] border-2 border-[#1E293B] rounded-2xl -rotate-1 shadow-pop-sm -z-10" />
            <span className="text-[#1E293B]">마음 날씨</span>
          </span>
          는 어떤가요?
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-3 max-w-2xl mx-auto font-medium">
          끝없는 마감과 분주한 일상에 굳어진 마음을 잠시 내려놓으세요.
          <br className="hidden sm:inline" />
          현재 감정, 스트레스 부하, 회복 자원을 입체적으로 진단하고
          따뜻한 위로와 3분 액션 플랜을 선물합니다.
        </p>
      </div>

      {/* Primary Action Button (The "Candy Button") */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          id="btn-start-diagnosis"
          onClick={onStart}
          className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-heading font-extrabold text-base sm:text-lg border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-sm transition-all flex items-center justify-center gap-3 group cursor-pointer"
        >
          <span>마음 날씨 진단 시작하기</span>
          <div className="w-8 h-8 rounded-full bg-white text-[#8B5CF6] flex items-center justify-center border-2 border-[#1E293B] group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>
      </div>

      {/* 3-Step Assessment Architecture Sticker Grid */}
      <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {/* Step 1 Card (Yellow Accent) */}
        <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-pop-card hover:-translate-y-1.5 transition-all relative flex flex-col justify-between group">
          {/* Floating Offset Icon Badge */}
          <div className="absolute -top-6 left-6 w-12 h-12 rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] shadow-pop-sm flex items-center justify-center text-[#1E293B] group-hover:rotate-6 transition-transform">
            <Sun className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="pt-3">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#FBBF24]/30 border border-[#1E293B] text-[11px] font-bold text-[#1E293B] mb-2 uppercase">
              Step 01 • 실시간 감정
            </div>
            <h3 className="font-heading font-extrabold text-[#1E293B] text-lg sm:text-xl mb-2">
              오늘의 감정 기후
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              지친, 평온한, 불안한, 기대되는 등 지금 마음에 머무는 단어들을 직관적으로 터치합니다.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Q1 다중 선택</span>
            <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
          </div>
        </div>

        {/* Step 2 Card (Pink Accent) */}
        <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-pop-card hover:-translate-y-1.5 transition-all relative flex flex-col justify-between group">
          <div className="absolute -top-6 left-6 w-12 h-12 rounded-2xl bg-[#F472B6] border-2 border-[#1E293B] shadow-pop-sm flex items-center justify-center text-white group-hover:-rotate-6 transition-transform">
            <CloudRain className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="pt-3">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#F472B6]/25 border border-[#1E293B] text-[11px] font-bold text-[#1E293B] mb-2 uppercase">
              Step 02 • PSS 척도
            </div>
            <h3 className="font-heading font-extrabold text-[#1E293B] text-lg sm:text-xl mb-2">
              마음의 무게 (스트레스)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              최근 돌발 사건, 감당 업무량, 통제력 및 대처력을 과학적 4문항 척도로 측정합니다.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Q2~Q5 척도 검사</span>
            <span className="w-2 h-2 rounded-full bg-[#F472B6]" />
          </div>
        </div>

        {/* Step 3 Card (Mint Accent) */}
        <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-pop-card hover:-translate-y-1.5 transition-all relative flex flex-col justify-between group">
          <div className="absolute -top-6 left-6 w-12 h-12 rounded-2xl bg-[#34D399] border-2 border-[#1E293B] shadow-pop-sm flex items-center justify-center text-[#1E293B] group-hover:rotate-6 transition-transform">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="pt-3">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#34D399]/30 border border-[#1E293B] text-[11px] font-bold text-[#1E293B] mb-2 uppercase">
              Step 03 • KRQ 척도
            </div>
            <h3 className="font-heading font-extrabold text-[#1E293B] text-lg sm:text-xl mb-2">
              마음의 근육 (회복력)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              자기조절, 관계지지, 긍정성, 원인분석의 4개 핵심 영역을 통해 내면 자원을 확인합니다.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Q6~Q9 회복탄력성</span>
            <span className="w-2 h-2 rounded-full bg-[#34D399]" />
          </div>
        </div>
      </div>
    </div>
  );
};


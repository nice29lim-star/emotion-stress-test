import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Clock, CloudRain, Sun, Zap, Activity } from 'lucide-react';
import { WellnessLog } from '../types';

interface LandingHeroProps {
  onStart: () => void;
  onViewHistory: () => void;
  recentLog?: WellnessLog;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStart,
  onViewHistory,
  recentLog,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-14 px-4 sm:px-6">
      {/* Top Badge */}
      <div className="flex justify-center mb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-stone-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-xs text-stone-700 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Google Gemini AI 기반 심리 진단 리포트</span>
        </div>
      </div>

      {/* Main Title & Warm Comfort Copy */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.25]">
          오늘 하루, 당신의 <br className="hidden sm:inline" />
          <span className="text-teal-700 underline decoration-teal-300 decoration-wavy underline-offset-8">
            마음 날씨
          </span>
          는 어떤가요?
        </h1>
        <p className="text-stone-600 text-base sm:text-lg leading-relaxed pt-2">
          끝없는 마감과 일상에 치여 굳어진 마음을 잠시 내려놓으세요.
          <br className="hidden sm:inline" />
          현재 감정, 스트레스 부하, 회복 자원을 입체적으로 진단하여
          따뜻한 위로와 3분 액션 플랜을 전해드립니다.
        </p>
      </div>

      {/* Primary Action Button */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <button
          id="btn-start-diagnosis"
          onClick={onStart}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-base shadow-lg shadow-teal-700/20 hover:shadow-teal-700/30 transition-all flex items-center justify-center gap-2.5 group active:scale-98 cursor-pointer"
        >
          <span>마음 날씨 진단 시작하기</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {recentLog && (
          <button
            id="btn-view-recent-log"
            onClick={onViewHistory}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/80 hover:bg-white text-stone-700 font-medium text-base border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-stone-300 transition-all flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4 text-stone-500" />
            <span>최근 기록 확인하기</span>
          </button>
        )}
      </div>

      {/* 3-Step Assessment Architecture Grid */}
      <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Step 1 Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-stone-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:border-stone-300 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60 mb-4">
              <Sun className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-amber-700 tracking-wide uppercase mb-1">
              Step 01 • 실시간 감정
            </div>
            <h3 className="font-semibold text-stone-900 text-base mb-2">
              오늘의 감정 날씨
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              지친, 우울한, 불안한, 평온한, 기대되는, 예민한 등 지금 마음에 머무는 단어들을 직관적으로 선택합니다.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-500">
            <span>총 1개 문항 (다중 선택)</span>
          </div>
        </div>

        {/* Step 2 Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-stone-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:border-stone-300 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200/60 mb-4">
              <CloudRain className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-rose-700 tracking-wide uppercase mb-1">
              Step 02 • PSS 척도
            </div>
            <h3 className="font-semibold text-stone-900 text-base mb-2">
              마음의 무게 (스트레스)
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              최근 한 달간의 돌발 사건, 감당 업무량, 통제력 상실감 및 대처 능력을 바탕으로 스트레스 부하를 측정합니다.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-500">
            <span>총 4개 문항 (0~4점 척도)</span>
          </div>
        </div>

        {/* Step 3 Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-stone-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:border-stone-300 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase mb-1">
              Step 03 • KRQ 척도
            </div>
            <h3 className="font-semibold text-stone-900 text-base mb-2">
              마음의 근육 (회복탄력성)
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              자기조절, 대인관계 지지망, 긍정성, 원인분석의 4개 핵심 영역을 측정하여 내면의 회복 자원을 도출합니다.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-500">
            <span>총 4개 문항 (1~5점 척도)</span>
          </div>
        </div>
      </div>

      {/* Safety & Trust Note */}
      <div className="mt-10 p-4 rounded-2xl bg-stone-100/70 border border-stone-200/60 flex items-center justify-between flex-wrap gap-3 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
          <span>모든 검사 데이터는 사용자의 안전을 위해 브라우저 로컬 저장소에 암호화 보관되며 외부로 노출되지 않습니다.</span>
        </div>
        <div className="flex items-center gap-1 text-stone-500 font-medium">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>따뜻한 경어체 상담 코칭 적용</span>
        </div>
      </div>
    </div>
  );
};

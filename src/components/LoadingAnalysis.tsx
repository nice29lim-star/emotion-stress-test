import React, { useEffect, useState } from 'react';
import { Cloud, Sun, Sparkles, Heart } from 'lucide-react';

const MESSAGES = [
  '마음 날씨를 분석하고 있어요...',
  '선택하신 감정과 스트레스 부하를 살피고 있습니다...',
  '내면의 회복탄력성 자원을 종합하고 있습니다...',
  '당신만을 위한 따뜻한 위로와 3분 액션 플랜을 준비 중입니다...',
];

export const LoadingAnalysis: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto py-16 sm:py-24 px-4 text-center">
      {/* Animated Floating Graphic */}
      <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
        {/* Pulsing Soft Glow */}
        <div className="absolute inset-0 rounded-full bg-teal-200/40 blur-2xl animate-pulse" />
        <div className="absolute -inset-4 rounded-full bg-amber-200/30 blur-3xl animate-ping opacity-30" />

        {/* Floating Sun */}
        <div className="absolute -top-1 -right-1 w-12 h-12 rounded-full bg-amber-100 border border-amber-300 text-amber-500 flex items-center justify-center shadow-md animate-bounce">
          <Sun className="w-7 h-7 animate-spin duration-1000" />
        </div>

        {/* Center Cloud Container */}
        <div className="w-24 h-24 rounded-3xl bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-lg flex items-center justify-center text-teal-700 relative z-10">
          <Cloud className="w-12 h-12 animate-pulse text-teal-600" />
          <Sparkles className="w-4 h-4 text-amber-500 absolute top-3 right-3 animate-ping" />
        </div>
      </div>

      {/* Rotating Reassuring Message */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 transition-opacity duration-500">
          {MESSAGES[msgIndex]}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
          Google AI Studio Gemini 모델이 임상 심리학적 기준에 맞춰 객관적이고 따뜻한 리포트를 구성하고 있습니다.
        </p>
      </div>

      {/* Mindful prompt while waiting */}
      <div className="mt-10 p-4 rounded-2xl bg-white/70 border border-stone-200/60 shadow-xs max-w-sm mx-auto flex items-center justify-center gap-2 text-xs text-stone-600">
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
        <span>잠시 어깨의 힘을 빼고 천천히 숨을 들이마셔 보세요.</span>
      </div>
    </div>
  );
};

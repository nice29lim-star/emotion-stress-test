import React, { useEffect, useState } from 'react';
import { Cloud, Sun, Sparkles, Heart } from 'lucide-react';

const MESSAGES = [
  '마음 날씨를 꼼꼼하게 분석하고 있어요...',
  '선택하신 감정과 스트레스 부하를 살피고 있습니다...',
  '내면의 회복탄력성 자원을 종합하고 있습니다...',
  '포미와의 대화 내용을 반영해 3분 액션 플랜을 준비 중입니다...',
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
      {/* Animated Playful Mascot Graphic */}
      <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
        {/* Playful Floating Sun */}
        <div className="absolute -top-2 -right-2 w-14 h-14 rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-center shadow-pop animate-bounce z-20">
          <Sun className="w-8 h-8 stroke-[2.5] animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Floating Pink Heart Accent */}
        <div className="absolute -bottom-2 -left-2 w-11 h-11 rounded-2xl bg-[#F472B6] border-2 border-[#1E293B] text-white flex items-center justify-center shadow-pop-sm z-20">
          <Heart className="w-5 h-5 fill-white stroke-[2]" />
        </div>

        {/* Center Cloud Box */}
        <div className="w-28 h-28 rounded-3xl bg-white border-2 border-[#1E293B] shadow-pop-card flex items-center justify-center text-[#8B5CF6] relative z-10">
          <Cloud className="w-14 h-14 stroke-[2.5] animate-pulse" />
          <Sparkles className="w-5 h-5 text-[#FBBF24] fill-[#FBBF24] absolute top-3 right-3 animate-ping" />
        </div>
      </div>

      {/* Rotating Reassuring Message */}
      <div className="space-y-3">
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E293B] transition-opacity duration-500 min-h-[4rem] flex items-center justify-center">
          {MESSAGES[msgIndex]}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
          Google AI Studio Gemini가 임상 심리학적 기준에 맞춰 객관적이고 따뜻한 리포트를 작성하고 있습니다.
        </p>
      </div>

      {/* Playful Progress Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {MESSAGES.map((_, i) => (
          <div
            key={i}
            className={`h-2.5 rounded-full border-2 border-[#1E293B] transition-all duration-300 ${
              i === msgIndex ? 'w-8 bg-[#8B5CF6]' : 'w-2.5 bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Mindful prompt while waiting */}
      <div className="mt-8 p-4 rounded-2xl bg-white border-2 border-[#1E293B] shadow-pop-sm max-w-sm mx-auto flex items-center justify-center gap-2.5 text-xs text-[#1E293B] font-bold">
        <Heart className="w-4 h-4 text-[#F472B6] fill-[#F472B6] animate-pulse" />
        <span>잠시 어깨 힘을 빼고 천천히 숨을 들이마셔 보세요.</span>
      </div>
    </div>
  );
};


import React from 'react';
import { X, PhoneCall, ShieldCheck, HeartHandshake, ExternalLink } from 'lucide-react';

interface SafetyHotlineModalProps {
  onClose: () => void;
}

export const SafetyHotlineModal: React.FC<SafetyHotlineModalProps> = ({ onClose }) => {
  const hotlines = [
    {
      name: '24시간 통합 위기 상담전화',
      number: '109',
      subtext: '전문 상담사가 365일 24시간 비밀을 보장하며 함께합니다.',
      category: '24시간 긴급',
      highlight: true,
    },
    {
      name: '정신건강 위기 상담전화',
      number: '1577-0199',
      subtext: '보건복지부 및 정신건강복지센터 전문 심리 상담 지원',
      category: '전문 심리지원',
      highlight: false,
    },
    {
      name: '청소년 전화 / 청년 심리지원',
      number: '1388',
      subtext: '학업, 진로, 대인관계 고민 및 정서적 위기 상담',
      category: '청소년/청년',
      highlight: false,
    },
    {
      name: '국가트라우마센터 마음안심버스',
      number: '02-2204-0001',
      subtext: '재난 및 심리적 외상 후 스트레스 전문 상담',
      category: '트라우마 전문',
      highlight: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl relative overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              마음 건강 안심 지원망 안내
            </h2>
            <p className="text-xs text-stone-500">
              혼자서 감당하기 힘들 때는 언제든 전문가의 도움을 요청하세요.
            </p>
          </div>
        </div>

        <div className="my-4 space-y-2.5">
          {hotlines.map((h, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                h.highlight
                  ? 'bg-rose-50/70 border-rose-200'
                  : 'bg-stone-50/70 border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-stone-900">
                    {h.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700 font-medium">
                    {h.category}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-tight">
                  {h.subtext}
                </p>
              </div>

              <a
                href={`tel:${h.number.replace(/-/g, '')}`}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 font-mono font-bold text-xs sm:text-sm shrink-0 flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                <span>{h.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-stone-100 text-stone-600 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
          <span>모든 전화 상담은 통화료가 무료이며 철저히 비밀이 보장됩니다.</span>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
        >
          확인 및 닫기
        </button>
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDF5] rounded-3xl p-6 sm:p-9 max-w-lg w-full border-3 border-[#1E293B] shadow-pop-card relative overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border-2 border-[#1E293B] bg-white text-[#1E293B] hover:bg-[#F472B6] hover:text-white shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F472B6] text-white flex items-center justify-center border-2 border-[#1E293B] shadow-pop-sm">
            <HeartHandshake className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1E293B]">
              마음 건강 안심 지원망
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              혼자서 감당하기 힘들 때는 언제든 전문가의 도움을 요청하세요.
            </p>
          </div>
        </div>

        <div className="my-4 space-y-3">
          {hotlines.map((h, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border-2 border-[#1E293B] transition-all flex items-center justify-between gap-3 shadow-pop-sm ${
                h.highlight
                  ? 'bg-[#F472B6]/15'
                  : 'bg-white'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs sm:text-sm font-heading font-extrabold text-[#1E293B]">
                    {h.name}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFFDF5] border border-[#1E293B] text-[#1E293B] font-bold">
                    {h.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-tight">
                  {h.subtext}
                </p>
              </div>

              <a
                href={`tel:${h.number.replace(/-/g, '')}`}
                className="px-4 py-2.5 rounded-full bg-[#1E293B] hover:bg-slate-800 text-white font-mono font-bold text-xs sm:text-sm shrink-0 flex items-center gap-1.5 border-2 border-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#34D399] stroke-[2.5]" />
                <span>{h.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-white border-2 border-[#1E293B] text-[#1E293B] text-xs font-bold flex items-center gap-2.5 shadow-pop-sm">
          <ShieldCheck className="w-5 h-5 text-[#34D399] stroke-[2.5] shrink-0" />
          <span>모든 전화 상담은 통화료가 무료이며 철저히 비밀이 보장됩니다.</span>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3.5 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E293B] font-heading font-extrabold text-xs sm:text-sm border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          확인 및 닫기
        </button>
      </div>
    </div>
  );
};


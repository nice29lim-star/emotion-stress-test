import React, { useState } from 'react';
import {
  EMOTIONS,
  PSS_QUESTIONS,
  PSS_OPTIONS,
  KRQ_QUESTIONS,
  KRQ_OPTIONS,
  calculateScores,
} from '../data/questions';
import { AssessmentPayload } from '../types';
import { ArrowLeft, ArrowRight, Check, Sparkles, AlertCircle, MessageSquareQuote, Heart, Sun, Activity, CloudRain } from 'lucide-react';

interface AssessmentFormProps {
  onSubmit: (payload: AssessmentPayload) => void;
  onCancel: () => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1 State
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);

  // Step 2 State (PSS)
  const [pssAnswers, setPssAnswers] = useState<Record<string, number>>({});

  // Step 3 State (KRQ)
  const [krqAnswers, setKrqAnswers] = useState<Record<string, number>>({});
  const [userNotes, setUserNotes] = useState<string>('');

  const [validationError, setValidationError] = useState<string | null>(null);

  // Toggle emotions in Step 1
  const toggleEmotion = (label: string) => {
    setValidationError(null);
    setSelectedEmotions((prev) =>
      prev.includes(label) ? prev.filter((e) => e !== label) : [...prev, label]
    );
  };

  // Set PSS answer
  const handleSetPSS = (questionId: string, value: number) => {
    setValidationError(null);
    setPssAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Set KRQ answer
  const handleSetKRQ = (questionId: string, value: number) => {
    setValidationError(null);
    setKrqAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Step Validation
  const canProceedStep1 = selectedEmotions.length > 0;
  const isStep2Complete = PSS_QUESTIONS.every((q) => pssAnswers[q.id] !== undefined);
  const isStep3Complete = KRQ_QUESTIONS.every((q) => krqAnswers[q.id] !== undefined);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!canProceedStep1) {
        setValidationError('지금 떠오르는 마음의 단어를 최소 1개 이상 골라주세요.');
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (!isStep2Complete) {
        setValidationError('모든 스트레스 문항에 답변을 선택해 주세요.');
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentStep === 2) setCurrentStep(1);
    if (currentStep === 3) setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (!isStep3Complete) {
      setValidationError('모든 회복탄력성 문항에 답변을 선택해 주세요.');
      return;
    }

    const scores = calculateScores(pssAnswers, krqAnswers);
    const payload: AssessmentPayload = {
      selectedEmotions,
      pssAnswers,
      krqAnswers,
      scores,
      userNotes: userNotes.trim() || undefined,
      timestamp: new Date().toISOString(),
    };

    onSubmit(payload);
  };

  const stepProgress = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Top Progress & Step Header with Playful Badge */}
      <div className="mb-8 p-5 sm:p-6 bg-white border-2 border-[#1E293B] rounded-3xl shadow-pop-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm font-bold text-slate-700 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-pop-sm flex items-center justify-center text-sm font-black font-mono">
              {currentStep}
            </span>
            <span className="font-heading font-extrabold text-base sm:text-lg text-[#1E293B]">
              {currentStep === 1 && 'Step 1 : 오늘의 마음 날씨 (실시간 감정)'}
              {currentStep === 2 && 'Step 2 : 마음의 무게 (스트레스 부하)'}
              {currentStep === 3 && 'Step 3 : 마음의 근육 (회복탄력성 자원)'}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#FBBF24] border-2 border-[#1E293B] text-[11px] font-extrabold text-[#1E293B] self-start sm:self-auto">
            {stepProgress}% 진행 완료
          </span>
        </div>

        {/* Chunky Progress Bar */}
        <div className="w-full h-3.5 bg-slate-100 border-2 border-[#1E293B] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stepProgress}%` }}
          />
        </div>
      </div>

      {/* Validation Banner */}
      {validationError && (
        <div className="mb-6 p-4 rounded-2xl bg-[#F472B6]/20 border-2 border-[#1E293B] text-[#1E293B] font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-pop-sm animate-bounce">
          <AlertCircle className="w-5 h-5 text-[#F472B6] fill-[#1E293B] shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP 1: EMOTIONS */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-pop-card">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBF24] border-2 border-[#1E293B] text-xs font-bold text-[#1E293B] mb-3 shadow-pop-sm">
                <Sun className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Q1. 실시간 감정 선택 (마음 기후)</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                지금 이 순간, 마음에 떠오르는 단어들을 골라주세요.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
                복수 선택이 가능합니다. 솔직한 현재 기분을 가볍게 터치해 보세요. (선택 후 다음 단계로 이동)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EMOTIONS.map((emotion) => {
                const isSelected = selectedEmotions.includes(emotion.label);
                return (
                  <button
                    key={emotion.id}
                    type="button"
                    onClick={() => toggleEmotion(emotion.label)}
                    className={`text-left p-4.5 rounded-2xl border-2 transition-all flex items-start gap-3.5 relative cursor-pointer group ${
                      isSelected
                        ? 'bg-[#8B5CF6] text-white border-[#1E293B] shadow-pop -translate-y-1'
                        : 'bg-[#FFFDF5] border-[#1E293B] hover:bg-white text-[#1E293B] shadow-pop-sm hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="text-3xl p-1 shrink-0 select-none group-hover:scale-110 transition-transform">
                      {emotion.emoji}
                    </span>
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-base sm:text-lg">{emotion.label}</span>
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-violet-100' : 'text-slate-500 font-medium'}`}>
                        {emotion.description}
                      </p>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 border-[#1E293B] flex items-center justify-center absolute top-4 right-4 transition-colors ${
                        isSelected
                          ? 'bg-[#FBBF24] text-[#1E293B]'
                          : 'bg-white text-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedEmotions.length > 0 && (
              <div className="mt-8 pt-5 border-t-2 border-slate-100 flex items-center gap-3 text-xs text-slate-700 font-bold flex-wrap">
                <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">선택된 감정 ({selectedEmotions.length}):</span>
                <div className="flex flex-wrap gap-2">
                  {selectedEmotions.map((e) => (
                    <span
                      key={e}
                      className="px-3 py-1 rounded-full bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-pop-sm font-bold"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: STRESS (PSS) */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-[#F472B6]/20 border-2 border-[#1E293B] rounded-3xl p-5 shadow-pop-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#F472B6] border-2 border-[#1E293B] text-white flex items-center justify-center shrink-0 shadow-pop-sm">
              <CloudRain className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
              <strong className="font-heading font-extrabold text-[#1E293B]">스트레스 척도 (PSS Q2 ~ Q5):</strong>
              <span className="ml-1">
                Q1 감정 선택에 이은 스트레스 부하 측정 문항입니다. 최근 한 달 동안 경험한 빈도를 기준으로 0점(전혀 없다)부터 4점(매우 자주 있다)까지 선택해 주세요.
              </span>
            </div>
          </div>

          {PSS_QUESTIONS.map((q, idx) => {
            const selectedVal = pssAnswers[q.id];
            return (
              <div
                key={q.id}
                className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-pop-card"
              >
                <div className="mb-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] text-xs font-bold shadow-pop-sm">
                      Q{q.number} (스트레스 문항 {idx + 1}/4)
                    </span>
                    {q.isReversed && (
                      <span className="px-3 py-1 rounded-full bg-[#34D399] text-[#1E293B] border-2 border-[#1E293B] text-[11px] font-bold shadow-pop-sm">
                        🌟 긍정적 대처 문항 (역채점)
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#1E293B] mt-3 leading-snug">
                    {q.text}
                  </h3>
                  {q.subtext && (
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">{q.subtext}</p>
                  )}
                </div>

                {/* 5-point choice buttons */}
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5 pt-2">
                  {PSS_OPTIONS.map((opt) => {
                    const isSelected = selectedVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSetPSS(q.id, opt.value)}
                        className={`min-h-[52px] sm:min-h-[60px] p-2.5 sm:p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-0.5 sm:gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#F472B6] border-[#1E293B] text-white shadow-pop -translate-y-0.5 font-bold'
                            : 'bg-[#FFFDF5] border-[#1E293B] hover:bg-[#F1F5F9] text-[#1E293B] shadow-pop-sm font-medium'
                        }`}
                      >
                        <span className="text-[11px] sm:text-xs md:text-sm font-bold text-center leading-tight">
                          {opt.label}
                        </span>
                        <span className={`text-[10px] sm:text-[11px] font-mono ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                          {opt.scoreText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 3: RESILIENCE (KRQ) & OPTIONAL NOTES */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-[#34D399]/20 border-2 border-[#1E293B] rounded-3xl p-5 shadow-pop-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#34D399] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-center shrink-0 shadow-pop-sm">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
              <strong className="font-heading font-extrabold text-[#1E293B]">회복탄력성 척도 (KRQ Q6 ~ Q9):</strong>
              <span className="ml-1">
                내면의 회복 자원을 진단합니다. 1점(전혀 그렇지 않다)부터 5점(매우 그렇다)까지 선택해 주세요. 완료 후 AI 마음 친구 '포미'와의 대화가 이어집니다.
              </span>
            </div>
          </div>

          {KRQ_QUESTIONS.map((q, idx) => {
            const selectedVal = krqAnswers[q.id];
            return (
              <div
                key={q.id}
                className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-pop-card"
              >
                <div className="mb-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] text-xs font-bold shadow-pop-sm">
                      Q{q.number} (회복탄력성 문항 {idx + 1}/4)
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#34D399] text-[#1E293B] border-2 border-[#1E293B] text-[11px] font-bold shadow-pop-sm">
                      {q.dimensionLabel}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#1E293B] mt-3 leading-snug">
                    {q.text}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
                    {q.dimensionDescription}
                  </p>
                </div>

                {/* 5-point rating buttons */}
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5 pt-2">
                  {KRQ_OPTIONS.map((opt) => {
                    const isSelected = selectedVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSetKRQ(q.id, opt.value)}
                        className={`min-h-[52px] sm:min-h-[60px] p-2.5 sm:p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-0.5 sm:gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#34D399] border-[#1E293B] text-[#1E293B] shadow-pop -translate-y-0.5 font-bold'
                            : 'bg-[#FFFDF5] border-[#1E293B] hover:bg-[#F1F5F9] text-[#1E293B] shadow-pop-sm font-medium'
                        }`}
                      >
                        <span className="text-[11px] sm:text-xs md:text-sm font-bold text-center leading-tight">
                          {opt.label}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-600 font-mono">
                          {opt.scoreText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Optional User Reflection Notes */}
          <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-pop-card">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B] shadow-pop-sm">
                <MessageSquareQuote className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h4 className="font-heading font-extrabold text-[#1E293B] text-base sm:text-lg">
                오늘 내 마음에 남기고 싶은 한 줄 메모 (선택)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-3">
              요즘 나를 가장 힘들게 하거나 위로가 필요한 일이 있다면 편안하게 적어주세요. AI와의 대화 및 최종 리포트에 반영됩니다.
            </p>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="예: 마감 일정이 겹쳐서 잠을 설쳤어요. 머리를 맑게 식히고 싶어요."
              rows={3}
              maxLength={300}
              className="w-full p-4 rounded-2xl border-2 border-slate-300 focus:border-[#8B5CF6] focus:shadow-pop-violet text-xs sm:text-sm text-[#1E293B] font-medium placeholder:text-slate-400 resize-none bg-[#FFFDF5] outline-none transition-all"
            />
            <div className="text-right text-xs font-bold text-slate-400 mt-1 font-mono">
              {userNotes.length} / 300자
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons (Playful Candy Buttons) */}
      <div className="mt-10 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="px-6 py-3.5 rounded-full border-2 border-[#1E293B] bg-white hover:bg-[#FBBF24] text-[#1E293B] text-xs sm:text-sm font-bold shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>이전 단계</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3.5 rounded-full border-2 border-[#1E293B] bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            처음으로
          </button>
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-4 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-heading font-extrabold text-xs sm:text-sm border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-sm transition-all flex items-center gap-2.5 ml-auto cursor-pointer"
          >
            <span>다음 단계</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-4 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-heading font-extrabold text-xs sm:text-sm border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-sm transition-all flex items-center gap-2.5 ml-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>AI 마음 친구 '포미'와 대화하기</span>
          </button>
        )}
      </div>
    </div>
  );
};


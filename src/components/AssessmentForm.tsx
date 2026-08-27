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
import { ArrowLeft, ArrowRight, Check, Sparkles, AlertCircle, MessageSquareQuote } from 'lucide-react';

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

  // Progress percentage
  const stepProgress = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

  return (
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Top Progress & Step Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-stone-600 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
              {currentStep}
            </span>
            <span className="font-semibold text-stone-800">
              {currentStep === 1 && 'Step 1 : 오늘의 마음 날씨 (실시간 감정)'}
              {currentStep === 2 && 'Step 2 : 마음의 무게 (스트레스 부하)'}
              {currentStep === 3 && 'Step 3 : 마음의 근육 (회복탄력성 자원)'}
            </span>
          </div>
          <span className="text-stone-500">{stepProgress}% 완료</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-stone-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-700 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stepProgress}%` }}
          />
        </div>
      </div>

      {/* Validation Banner */}
      {validationError && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP 1: EMOTIONS */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-stone-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-6">
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                Q1. 실시간 감정 선택
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                지금 이 순간, 마음에 떠오르는 단어들을 골라주세요.
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
                복수 선택이 가능합니다. 솔직한 현재 기분을 가볍게 터치해 보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {EMOTIONS.map((emotion) => {
                const isSelected = selectedEmotions.includes(emotion.label);
                return (
                  <button
                    key={emotion.id}
                    type="button"
                    onClick={() => toggleEmotion(emotion.label)}
                    className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 relative cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/90 border-teal-600 text-teal-950 shadow-sm ring-1 ring-teal-600/30'
                        : 'bg-white/60 border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/80 text-stone-800'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl p-1 shrink-0 select-none">
                      {emotion.emoji}
                    </span>
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">{emotion.label}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                        {emotion.description}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center absolute top-4 right-4 transition-colors ${
                        isSelected
                          ? 'bg-teal-700 border-teal-700 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedEmotions.length > 0 && (
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-600">
                <span>선택된 감정:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEmotions.map((e) => (
                    <span
                      key={e}
                      className="px-2.5 py-1 rounded-full bg-teal-100/70 text-teal-800 font-medium"
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
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <span className="text-xl">⚖️</span>
            <div className="text-xs sm:text-sm text-amber-900">
              <strong className="font-semibold">스트레스 척도 (PSS 기반):</strong>
              <span className="ml-1">
                최근 한 달 동안 경험한 빈도를 기준으로 0점(전혀 없다)부터 4점(매우 자주 있다)까지 선택해 주세요.
              </span>
            </div>
          </div>

          {PSS_QUESTIONS.map((q) => {
            const selectedVal = pssAnswers[q.id];
            return (
              <div
                key={q.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-stone-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-semibold">
                      Q{q.number}
                    </span>
                    {q.isReversed && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-medium">
                        긍정적 대처 문항
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-stone-900 mt-2 leading-snug">
                    {q.text}
                  </h3>
                  {q.subtext && (
                    <p className="text-xs text-stone-500 mt-1">{q.subtext}</p>
                  )}
                </div>

                {/* 5-point choice cards */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                  {PSS_OPTIONS.map((opt) => {
                    const isSelected = selectedVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSetPSS(q.id, opt.value)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500/30 shadow-xs'
                            : 'bg-white/60 border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
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
          <div className="bg-teal-50/70 border border-teal-200/70 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <span className="text-xl">🌱</span>
            <div className="text-xs sm:text-sm text-teal-900">
              <strong className="font-semibold">회복탄력성 척도 (KRQ 기반):</strong>
              <span className="ml-1">
                내면의 회복 자원을 진단합니다. 1점(전혀 그렇지 않다)부터 5점(매우 그렇다)까지 선택해 주세요.
              </span>
            </div>
          </div>

          {KRQ_QUESTIONS.map((q) => {
            const selectedVal = krqAnswers[q.id];
            return (
              <div
                key={q.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-stone-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-semibold">
                      Q{q.number}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/60 text-[11px] font-medium">
                      {q.dimensionLabel}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-stone-900 mt-2 leading-snug">
                    {q.text}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {q.dimensionDescription}
                  </p>
                </div>

                {/* 5-point rating cards */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                  {KRQ_OPTIONS.map((opt) => {
                    const isSelected = selectedVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSetKRQ(q.id, opt.value)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50 border-teal-600 text-teal-950 ring-1 ring-teal-600/30 shadow-xs'
                            : 'bg-white/60 border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
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
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-stone-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareQuote className="w-4 h-4 text-stone-500" />
              <h4 className="font-semibold text-stone-800 text-sm">
                오늘 내 마음에 남기고 싶은 한 줄 메모 (선택)
              </h4>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              요즘 나를 가장 힘들게 하거나 위로가 필요한 일이 있다면 편안하게 적어주세요. AI가 리포트에 반영합니다.
            </p>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="예: 마감 일정이 겹쳐서 잠을 설쳤어요. 잠깐이라도 머리를 비우고 싶어요."
              rows={3}
              maxLength={300}
              className="w-full p-3.5 rounded-xl border border-stone-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 resize-none bg-stone-50/50"
            />
            <div className="text-right text-[11px] text-stone-400 mt-1">
              {userNotes.length} / 300자
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="px-5 py-3 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전 단계</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            처음으로
          </button>
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-teal-700/20 transition-all flex items-center gap-2 ml-auto cursor-pointer"
          >
            <span>다음 단계</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-7 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-teal-700/20 transition-all flex items-center gap-2 ml-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>마음 날씨 분석 리포트 생성</span>
          </button>
        )}
      </div>
    </div>
  );
};

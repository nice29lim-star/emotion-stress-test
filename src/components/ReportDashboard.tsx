import React, { useState } from 'react';
import { DiagnosisReport, RiskLevel } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Zap,
  RotateCcw,
  Copy,
  Check,
  Share2,
  Wind,
  HeartHandshake,
  Activity,
  Heart,
  FileText,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportDashboardProps {
  report: DiagnosisReport;
  onRetake: () => void;
  onOpenBreathing: () => void;
  onOpenHotline: () => void;
  onSaveToHistory?: (note?: string) => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  report,
  onRetake,
  onOpenBreathing,
  onOpenHotline,
  onSaveToHistory,
}) => {
  const [copied, setCopied] = useState(false);
  const [userNote, setUserNote] = useState(report.assessmentData.userNotes || '');
  const [noteSaved, setNoteSaved] = useState(false);

  const { scores, selectedEmotions } = report.assessmentData;

  // Risk styling
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case '안전':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: ShieldCheck,
          label: '마음 날씨 : 맑음 (안전)',
          desc: '심리적 균형이 건강하게 유지되고 있습니다.',
        };
      case '주의':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
          label: '마음 날씨 : 흐림 (주의)',
          desc: '스트레스가 누적되어 에너지 충전이 필요합니다.',
        };
      case '위험':
        return {
          bg: 'bg-rose-50 text-rose-900 border-rose-300',
          dot: 'bg-rose-500',
          icon: ShieldAlert,
          label: '마음 날씨 : 폭풍우 (위험/고갈)',
          desc: '즉각적인 쉼과 적극적인 심리 케어가 시급합니다.',
        };
    }
  };

  const riskInfo = getRiskBadge(report.riskLevel);
  const RiskIcon = riskInfo.icon;

  const handleCopy = () => {
    const summaryText = `[MindTracker 마음 날씨 진단 리포트]
■ ${report.reportTitle}
"${report.summarySentence}"

■ 현재 상태 분석:
${report.psychologicalAnalysis}

■ 추천 3분 액션:
${report.actionPlans.find((p) => p.type === 'immediate')?.title} - ${report.actionPlans.find((p) => p.type === 'immediate')?.description}

■ 회복탄력성 루틴:
${report.actionPlans.find((p) => p.type === 'routine')?.title} - ${report.actionPlans.find((p) => p.type === 'routine')?.description}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveNote = () => {
    if (onSaveToHistory) {
      onSaveToHistory(userNote);
    }
    setNoteSaved(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0d9488', '#f43f5e', '#f59e0b'],
    });
    setTimeout(() => setNoteSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6 sm:space-y-8">
      {/* 1. Header Banner & Title */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-100/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(report.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </span>
            <span className="text-xs text-stone-400">|</span>
            <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 종합 심리 리포트</span>
            </span>
          </div>

          {/* Risk Level Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${riskInfo.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${riskInfo.dot} animate-pulse`} />
            <RiskIcon className="w-4 h-4" />
            <span>{riskInfo.label}</span>
          </div>
        </div>

        {/* Report Main Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-snug">
          {report.reportTitle}
        </h1>

        {/* Comforting Summary Sentence Card */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-teal-50/80 border border-teal-200/70 text-teal-950 flex items-start gap-3.5">
          <Heart className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
              마음 처방전 한 줄
            </div>
            <p className="text-sm sm:text-base font-semibold leading-relaxed">
              "{report.summarySentence}"
            </p>
          </div>
        </div>

        {/* Selected Emotions Chip List */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2 flex-wrap text-xs text-stone-600">
          <span className="font-medium">감지된 마음 기후:</span>
          {selectedEmotions.map((emo) => (
            <span
              key={emo}
              className="px-2.5 py-1 rounded-full bg-stone-100/90 text-stone-800 font-medium border border-stone-200/60"
            >
              {emo}
            </span>
          ))}
        </div>
      </div>

      {/* High Risk Emergency Notice if applicable */}
      {report.riskLevel === '위험' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="font-semibold block mb-0.5">
                안내: 마음의 에너지가 심각하게 소진된 상태입니다.
              </strong>
              혼자서 버티려 하지 마시고, 필요할 땐 언제든 전문 상담 전화(무료/24시간)의 도움을 받으세요.
            </div>
          </div>
          <button
            onClick={onOpenHotline}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer"
          >
            지원 번호 확인
          </button>
        </div>
      )}

      {/* 2. Psychological Analysis & Clinical Insights */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-700" />
          <h2 className="text-lg sm:text-xl font-bold text-stone-900">
            임상 데이터 종합 마음 상태 분석
          </h2>
        </div>
        <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50/70 p-5 rounded-2xl border border-stone-200/60">
          {report.psychologicalAnalysis}
        </p>
      </div>

      {/* 3. Metrics Breakdown Grid: Stress (PSS) + Resilience (KRQ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Stress Metric Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <h3 className="font-bold text-stone-900 text-base">
                  스트레스 부하 (PSS)
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold">
                {scores.pssLevel}
              </span>
            </div>

            <div className="my-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-mono">
                {scores.pssTotal}
              </span>
              <span className="text-xs text-stone-500 font-medium">/ 16점 만점</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    scores.pssTotal >= 12
                      ? 'bg-rose-500'
                      : scores.pssTotal >= 8
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(5, scores.pssPercentage)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                <span>0점 (안정)</span>
                <span>8점 (주의)</span>
                <span>16점 (위험)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-4 pt-3 border-t border-stone-100">
            돌발 상황에 대한 통제감과 과중한 심리적 책임감의 비중을 종합 산출한 지표입니다.
          </p>
        </div>

        {/* Resilience Metric Card (KRQ) */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-600" />
                <h3 className="font-bold text-stone-900 text-base">
                  회복탄력성 자원 (KRQ)
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                평균 {scores.krqScores.totalAverage} / 5.0점
              </span>
            </div>

            {/* 4 KRQ Sub-Dimensions */}
            <div className="space-y-2.5 my-3">
              {[
                { label: '자기조절능력', val: scores.krqScores.selfRegulation, key: 'selfRegulation' },
                { label: '대인관계능력', val: scores.krqScores.interpersonal, key: 'interpersonal' },
                { label: '긍정성 & 희망', val: scores.krqScores.positivity, key: 'positivity' },
                { label: '원인분석력', val: scores.krqScores.causeAnalysis, key: 'causeAnalysis' },
              ].map((dim) => {
                const isLowest = scores.lowestKRQDimension.dimension === dim.key;
                return (
                  <div key={dim.label} className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className={`font-medium ${isLowest ? 'text-amber-800 font-semibold' : 'text-stone-700'}`}>
                        {dim.label} {isLowest && <span className="text-[10px] text-amber-600 font-normal">(보완 추천)</span>}
                      </span>
                      <span className="font-mono text-stone-600 font-semibold">{dim.val} / 5</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isLowest ? 'bg-amber-500' : 'bg-teal-600'
                        }`}
                        style={{ width: `${(dim.val / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-2 pt-3 border-t border-stone-100">
            가장 점수가 낮은 <strong className="text-stone-700 font-semibold">{scores.lowestKRQDimension.label}</strong>을 집중적으로 키울 수 있는 루틴이 처방되었습니다.
          </p>
        </div>
      </div>

      {/* 4. Action Plans (Immediate 3-min + Daily Routine) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              맞춤형 멘탈 케어 액션 플랜
            </h2>
          </div>
          <span className="text-xs text-stone-500">부담 없는 작은 실천부터 시작하세요</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.actionPlans.map((plan, idx) => {
            const isImmediate = plan.type === 'immediate';
            return (
              <div
                key={idx}
                className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                  isImmediate
                    ? 'bg-gradient-to-br from-teal-50/90 to-emerald-50/60 border-teal-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]'
                    : 'bg-white/80 backdrop-blur-md border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${
                        isImmediate
                          ? 'bg-teal-700 text-white'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {isImmediate ? '⚡ 즉각 3분 액션' : '🌱 데일리 루틴'}
                    </span>
                    {isImmediate && (
                      <span className="text-xs text-teal-700 font-semibold">소요시간 3분</span>
                    )}
                  </div>

                  <h3 className="font-bold text-stone-900 text-base sm:text-lg mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {isImmediate && (
                  <div className="mt-5 pt-4 border-t border-teal-200/60">
                    <button
                      id="btn-start-breathing-action"
                      onClick={onOpenBreathing}
                      className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                    >
                      <Wind className="w-4 h-4" />
                      <span>지금 3분 안심 호흡 시작하기</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. User Note & Journal Log Box */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <h3 className="text-sm font-bold text-stone-900 mb-1 flex items-center gap-2">
          <span>마음 일기 / 감상 기록</span>
          {noteSaved && (
            <span className="text-xs text-teal-600 font-normal flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 저장 완료!
            </span>
          )}
        </h3>
        <p className="text-xs text-stone-500 mb-3">
          진단을 마친 지금, 나에게 건네고 싶은 격려나 느낌을 기록해 두세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="예: 오늘은 조금 일찍 퇴근해서 따뜻한 차를 마셔야겠다."
            className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs sm:text-sm bg-stone-50/60 text-stone-800"
          />
          <button
            onClick={handleSaveNote}
            className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs sm:text-sm font-medium transition-colors shrink-0 cursor-pointer"
          >
            기록장에 저장
          </button>
        </div>
      </div>

      {/* 6. Footer Actions: Copy, Retake, Crisis Help */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/60">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-teal-700 font-semibold">복사되었습니다</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>리포트 요약 복사</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenHotline}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-medium border border-stone-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>24시간 전문 상담 안내</span>
          </button>
        </div>

        <button
          id="btn-retake-diagnosis"
          onClick={onRetake}
          className="px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>새로 진단하기</span>
        </button>
      </div>
    </div>
  );
};

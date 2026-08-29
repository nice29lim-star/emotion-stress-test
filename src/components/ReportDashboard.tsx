import React, { useState, useRef } from 'react';
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
  Sun,
  Flame,
  BookmarkPlus,
  Coffee,
  Lightbulb,
  Sprout,
  Clock,
  Download,
  Camera,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';

interface ReportDashboardProps {
  report: DiagnosisReport;
  onRetake: () => void;
  onOpenBreathing: () => void;
  onOpenHotline: () => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  report,
  onRetake,
  onOpenBreathing,
  onOpenHotline,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [userNote, setUserNote] = useState(report.assessmentData.userNotes || '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const { scores, selectedEmotions } = report.assessmentData;

  // Risk styling
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case '안전':
        return {
          bg: 'bg-[#34D399] text-[#1E293B] border-2 border-[#1E293B] shadow-pop-sm',
          dot: 'bg-[#1E293B]',
          icon: ShieldCheck,
          label: '마음 날씨 : 맑음 (안전)',
          desc: '심리적 균형이 건강하게 유지되고 있습니다.',
        };
      case '주의':
        return {
          bg: 'bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] shadow-pop-sm',
          dot: 'bg-[#1E293B]',
          icon: AlertTriangle,
          label: '마음 날씨 : 흐림 (주의)',
          desc: '스트레스가 누적되어 에너지 충전이 필요합니다.',
        };
      case '위험':
        return {
          bg: 'bg-[#F472B6] text-white border-2 border-[#1E293B] shadow-pop-sm',
          dot: 'bg-white',
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
    setNoteSaved(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399'],
    });
    setTimeout(() => setNoteSaved(false), 3000);
  };

  const handleDownloadImage = async () => {
    if (!reportRef.current || isExporting) return;
    setIsExporting(true);

    try {
      // Small pause to ensure rendering is idle
      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FFFDF5',
        filter: (node) => {
          if (node instanceof HTMLElement && node.dataset.exportHide === 'true') {
            return false;
          }
          return true;
        },
      });

      const dateStr = new Date(report.createdAt).toISOString().slice(0, 10);
      const link = document.createElement('a');
      link.download = `MindTracker_마음날씨리포트_${dateStr}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccess(true);
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399'],
      });
      setTimeout(() => setExportSuccess(false), 4500);
    } catch (err) {
      console.error('Failed to export image:', err);
      alert('이미지 저장 중 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-7">
      {/* Export Success Toast */}
      {exportSuccess && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1E293B] text-white border-2 border-[#34D399] shadow-pop flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-8 h-8 rounded-xl bg-[#34D399] text-[#1E293B] flex items-center justify-center font-bold">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#34D399]">이미지 저장 완료! 📸</div>
            <div className="text-[11px] text-slate-200">다운로드 폴더에 PNG 리포트가 안전하게 보관되었습니다.</div>
          </div>
        </div>
      )}

      {/* Top Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-[#1E293B] shadow-pop-sm" data-export-hide="true">
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#1E293B]">
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          <span>나만의 마음 리포트가 완성되었습니다.</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="px-4 py-2 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-heading font-extrabold border-2 border-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>이미지 생성 중...</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" />
                <span>📸 이미지로 저장하기</span>
              </>
            )}
          </button>
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-full bg-[#FFFDF5] hover:bg-[#FBBF24] text-[#1E293B] text-xs font-bold border-2 border-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#34D399] stroke-[3]" />
                <span>복사됨</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>요약 복사</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Report Container to capture */}
      <div ref={reportRef} className="space-y-7 p-2 sm:p-4 rounded-3xl bg-[#FFFDF5]">
      {/* 1. Header Banner & Title */}
      <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-9 shadow-pop-card relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs px-3.5 py-1.5 rounded-full bg-slate-100 border-2 border-[#1E293B] text-[#1E293B] font-bold flex items-center gap-1.5 shadow-pop-sm">
              <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                {new Date(report.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </span>
            <span className="text-xs px-3.5 py-1.5 rounded-full bg-[#8B5CF6] text-white border-2 border-[#1E293B] font-bold flex items-center gap-1 shadow-pop-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 종합 심리 리포트</span>
            </span>
          </div>

          {/* Risk Level Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-heading font-extrabold text-xs ${riskInfo.bg}`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${riskInfo.dot} animate-pulse`} />
            <RiskIcon className="w-4 h-4 stroke-[2.5]" />
            <span>{riskInfo.label}</span>
          </div>
        </div>

        {/* Report Main Title */}
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E293B] tracking-tight leading-snug mt-2">
          {report.reportTitle}
        </h1>

        {/* Comforting Summary Sentence Card */}
        <div className="mt-5 p-5 sm:p-6 rounded-3xl bg-[#FBBF24]/25 border-2 border-[#1E293B] text-[#1E293B] flex items-start gap-4 shadow-pop-sm">
          <div className="w-10 h-10 rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center shrink-0 shadow-pop-sm">
            <Heart className="w-5 h-5 fill-[#1E293B]" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#1E293B] mb-1 font-heading">
              마음 처방전 한 줄
            </div>
            <p className="text-base sm:text-lg font-heading font-extrabold leading-relaxed text-[#1E293B]">
              "{report.summarySentence}"
            </p>
          </div>
        </div>

        {/* Selected Emotions Chip List */}
        <div className="mt-6 pt-5 border-t-2 border-slate-100 flex items-center gap-2.5 flex-wrap text-xs text-[#1E293B] font-bold">
          <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-300">감지된 마음 기후:</span>
          {selectedEmotions.map((emo) => (
            <span
              key={emo}
              className="px-3 py-1 rounded-full bg-[#FFFDF5] text-[#1E293B] font-bold border-2 border-[#1E293B] shadow-pop-sm"
            >
              {emo}
            </span>
          ))}
        </div>
      </div>

      {/* High Risk Emergency Notice if applicable */}
      {report.riskLevel === '위험' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#F472B6]/20 border-2 border-[#1E293B] text-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-pop-card">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F472B6] border-2 border-[#1E293B] text-white flex items-center justify-center shrink-0 shadow-pop-sm">
              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm">
              <strong className="font-heading font-extrabold text-base block mb-0.5 text-[#1E293B]">
                안내: 마음의 에너지가 심각하게 소진된 상태입니다.
              </strong>
              혼자서 버티려 하지 마시고, 필요할 땐 언제든 전문 상담 전화(무료/24시간)의 도움을 받으세요.
            </div>
          </div>
          <button
            onClick={onOpenHotline}
            className="px-5 py-3 rounded-full bg-[#F472B6] hover:bg-[#EC4899] text-white font-heading font-extrabold text-xs border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all shrink-0 cursor-pointer"
          >
            지원 번호 확인
          </button>
        </div>
      )}

      {/* 2. Psychological Analysis & Clinical Insights */}
      <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-pop-card space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#8B5CF6] border-2 border-[#1E293B] text-white flex items-center justify-center shadow-pop-sm">
            <FileText className="w-4 h-4 stroke-[2.5]" />
          </div>
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#1E293B]">
            임상 데이터 종합 마음 상태 분석
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#1E293B] font-medium leading-relaxed whitespace-pre-line bg-[#FFFDF5] p-5 sm:p-6 rounded-3xl border-2 border-[#1E293B] shadow-pop-sm">
          {report.psychologicalAnalysis}
        </p>

        {/* AI Coach Chat History Review if present */}
        {report.assessmentData.chatHistory && report.assessmentData.chatHistory.length > 1 && (
          <div className="mt-4 pt-3 border-t-2 border-slate-100">
            <details className="group">
              <summary className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#8B5CF6] cursor-pointer p-3 rounded-2xl bg-violet-50/60 hover:bg-violet-100/80 border-2 border-violet-200 transition-colors select-none">
                <div className="flex items-center gap-2">
                  <span>💬 AI 마음 친구 '포미'와 나눈 대화 ({report.assessmentData.chatHistory.length}개 메시지)</span>
                </div>
                <span className="text-xs text-slate-500 font-bold group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 space-y-3 p-4 rounded-3xl bg-[#FFFDF5] border-2 border-[#1E293B] max-h-72 overflow-y-auto">
                {report.assessmentData.chatHistory.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.role === 'assistant'
                        ? 'bg-white border-2 border-[#1E293B] text-[#1E293B] shadow-pop-sm'
                        : 'bg-[#8B5CF6] text-white border-2 border-[#1E293B] ml-6 font-bold shadow-pop-sm'
                    }`}
                  >
                    <div className="font-bold text-[10px] mb-1 opacity-80 font-mono">
                      {m.role === 'assistant' ? '☁️ 마음 코치 포미' : '👤 나의 이야기'} • {m.timestamp}
                    </div>
                    <p className="whitespace-pre-line">{m.content}</p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* 3. Metrics Breakdown Grid: Stress (PSS) + Resilience (KRQ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stress Metric Card */}
        <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-pop-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#F472B6] border-2 border-[#1E293B]" />
                <h3 className="font-heading font-extrabold text-[#1E293B] text-base sm:text-lg">
                  스트레스 부하 (PSS)
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#F472B6]/20 border-2 border-[#1E293B] text-[#1E293B] font-extrabold">
                {scores.pssLevel}
              </span>
            </div>

            <div className="my-4 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-[#1E293B] font-mono tracking-tight">
                {scores.pssTotal}
              </span>
              <span className="text-xs text-slate-500 font-bold">/ 16점 만점</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-2">
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border-2 border-[#1E293B]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    scores.pssTotal >= 12
                      ? 'bg-[#F472B6]'
                      : scores.pssTotal >= 8
                      ? 'bg-[#FBBF24]'
                      : 'bg-[#34D399]'
                  }`}
                  style={{ width: `${Math.max(8, scores.pssPercentage)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-bold font-mono">
                <span>0점 (안정)</span>
                <span>8점 (주의)</span>
                <span>16점 (위험)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium mt-5 pt-3 border-t-2 border-slate-100">
            돌발 상황에 대한 통제감과 과중한 심리적 책임감의 비중을 종합 산출한 지표입니다.
          </p>
        </div>

        {/* Resilience Metric Card (KRQ) */}
        <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-pop-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#34D399] border-2 border-[#1E293B]" />
                <h3 className="font-heading font-extrabold text-[#1E293B] text-base sm:text-lg">
                  회복탄력성 자원 (KRQ)
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#34D399] text-[#1E293B] font-extrabold border-2 border-[#1E293B] shadow-pop-sm">
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
                      <span className={`font-bold ${isLowest ? 'text-[#1E293B]' : 'text-slate-700'}`}>
                        {dim.label} {isLowest && <span className="px-1.5 py-0.5 rounded bg-[#FBBF24] border border-[#1E293B] text-[10px] font-bold ml-1">보완 추천</span>}
                      </span>
                      <span className="font-mono text-[#1E293B] font-extrabold">{dim.val} / 5</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 border border-[#1E293B] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isLowest ? 'bg-[#FBBF24]' : 'bg-[#34D399]'
                        }`}
                        style={{ width: `${(dim.val / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium mt-2 pt-3 border-t-2 border-slate-100">
            가장 점수가 낮은 <strong className="text-[#1E293B] font-bold">{scores.lowestKRQDimension.label}</strong>을 집중적으로 키울 수 있는 루틴이 처방되었습니다.
          </p>
        </div>
      </div>

      {/* 4. Action Plans (Immediate + Micro-healing + Routine + Mindset) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FBBF24] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-center shadow-pop-sm">
              <Zap className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#1E293B]">
              맞춤형 멘탈 케어 액션 플랜
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-bold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            🌱 부담 없는 소소한 실천부터 시작해보세요
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {report.actionPlans.map((plan, idx) => {
            const planType = plan.type;
            const isImmediate = planType === 'immediate';
            const isMicro = planType === 'micro';
            const isRoutine = planType === 'routine';
            const isMindset = planType === 'mindset';

            // Distinctive visual themes
            let cardBg = 'bg-white';
            let badgeBg = 'bg-[#FBBF24] text-[#1E293B]';
            let badgeText = plan.categoryTag || '🌱 마음 루틴';
            let IconComponent = Sprout;

            if (isImmediate) {
              cardBg = 'bg-[#8B5CF6]/10';
              badgeBg = 'bg-[#8B5CF6] text-white';
              badgeText = plan.categoryTag || '⚡ 3분 즉각 리셋';
              IconComponent = Wind;
            } else if (isMicro) {
              cardBg = 'bg-[#FBBF24]/10';
              badgeBg = 'bg-[#FBBF24] text-[#1E293B]';
              badgeText = plan.categoryTag || '☕ 소소한 일상 힐링';
              IconComponent = Coffee;
            } else if (isRoutine) {
              cardBg = 'bg-[#34D399]/10';
              badgeBg = 'bg-[#34D399] text-[#1E293B]';
              badgeText = plan.categoryTag || '🌱 마음근육 데일리 루틴';
              IconComponent = Sprout;
            } else if (isMindset) {
              cardBg = 'bg-[#F472B6]/10';
              badgeBg = 'bg-[#F472B6] text-white';
              badgeText = plan.categoryTag || '💡 나를 위한 한마디';
              IconComponent = Lightbulb;
            }

            return (
              <div
                key={idx}
                className={`rounded-3xl p-6 sm:p-7 border-2 border-[#1E293B] transition-all flex flex-col justify-between shadow-pop-card hover:-translate-y-0.5 ${cardBg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5 gap-2">
                    <span
                      className={`text-xs px-3.5 py-1.5 rounded-full font-heading font-extrabold border-2 border-[#1E293B] shadow-pop-sm flex items-center gap-1.5 ${badgeBg}`}
                    >
                      <IconComponent className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{badgeText}</span>
                    </span>

                    {plan.duration && (
                      <span className="text-xs text-slate-600 font-bold flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-[#1E293B]/30">
                        <Clock className="w-3 h-3 stroke-[2.5] text-slate-500" />
                        {plan.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-extrabold text-[#1E293B] text-lg mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {isImmediate && (
                  <div className="mt-6 pt-4 border-t-2 border-violet-200/80">
                    <button
                      id="btn-start-breathing-action"
                      onClick={onOpenBreathing}
                      className="w-full py-3 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-heading font-extrabold text-xs sm:text-sm border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Wind className="w-4 h-4 stroke-[2.5]" />
                      <span>지금 3분 안심 호흡 가이드 켜기</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. User Note & Journal Log Box */}
      <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-pop-card">
        <h3 className="font-heading font-extrabold text-base text-[#1E293B] mb-1 flex items-center gap-2">
          <span>마음 일기 / 감상 기록</span>
          {noteSaved && (
            <span className="text-xs text-[#34D399] font-bold flex items-center gap-1 bg-[#34D399]/20 px-2.5 py-0.5 rounded-full border border-[#34D399]">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> 저장 완료!
            </span>
          )}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-3.5">
          진단을 마친 지금, 나에게 건네고 싶은 격려나 느낌을 기록해 두세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="예: 오늘은 조금 일찍 퇴근해서 따뜻한 차를 마셔야겠다."
            className="flex-1 px-5 py-3.5 rounded-full border-2 border-slate-300 focus:border-[#8B5CF6] focus:shadow-pop-violet text-xs sm:text-sm bg-[#FFFDF5] text-[#1E293B] font-medium outline-none transition-all"
          />
          <button
            onClick={handleSaveNote}
            className="px-7 py-3.5 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E293B] font-heading font-extrabold text-xs sm:text-sm border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <BookmarkPlus className="w-4 h-4 stroke-[2.5]" />
            <span>마음에 새기기</span>
          </button>
        </div>
      </div>
      </div>

      {/* 6. Footer Actions: Copy, Download Image, Retake, Crisis Help */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t-2 border-slate-200" data-export-hide="true">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="px-5 py-3 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-heading font-extrabold border-2 border-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>이미지 파일 생성 중...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>리포트 이미지 저장 (PNG)</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="px-5 py-3 rounded-full bg-white hover:bg-[#FBBF24] text-[#1E293B] text-xs sm:text-sm font-bold border-2 border-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#34D399] stroke-[3]" />
                <span className="text-[#1E293B] font-extrabold">복사되었습니다</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2.5]" />
                <span>리포트 요약 복사</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenHotline}
            className="px-5 py-3 rounded-full bg-white hover:bg-[#F472B6]/20 text-[#1E293B] text-xs sm:text-sm font-bold border-2 border-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-[#F472B6] stroke-[2.5]" />
            <span>24시간 전문 상담 안내</span>
          </button>
        </div>

        <button
          id="btn-retake-diagnosis"
          onClick={onRetake}
          className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-[#1E293B] text-xs sm:text-sm font-heading font-extrabold border-2 border-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer ml-auto sm:ml-0"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>새로 진단하기</span>
        </button>
      </div>
    </div>
  );
};


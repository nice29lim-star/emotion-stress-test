import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { AssessmentForm } from './components/AssessmentForm';
import { AICoachChat } from './components/AICoachChat';
import { LoadingAnalysis } from './components/LoadingAnalysis';
import { ReportDashboard } from './components/ReportDashboard';
import { BreathingModal } from './components/BreathingModal';
import { SafetyHotlineModal } from './components/SafetyHotlineModal';
import { AssessmentPayload, DiagnosisReport } from './types';
import confetti from 'canvas-confetti';
import { CloudSun } from 'lucide-react';

export default function App() {
  // Assessment stages
  const [assessmentStage, setAssessmentStage] = useState<'landing' | 'form' | 'chat' | 'loading' | 'result'>('landing');

  // Stored pending payload before or during chat
  const [pendingPayload, setPendingPayload] = useState<AssessmentPayload | null>(null);

  // Active Report
  const [activeReport, setActiveReport] = useState<DiagnosisReport | null>(null);

  // Modals
  const [showBreathingModal, setShowBreathingModal] = useState<boolean>(false);
  const [showHotlineModal, setShowHotlineModal] = useState<boolean>(false);

  // Transition from Form to AI Coach Chat
  const handleProceedToChat = (payload: AssessmentPayload) => {
    setPendingPayload(payload);
    setAssessmentStage('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createFallbackReport = (payload: AssessmentPayload): DiagnosisReport => {
    const lastUserMsg = payload.chatHistory?.filter((m) => m.role === 'user').slice(-1)[0]?.content || '';
    let contextualSummary = '조금 지쳐있더라도, 당신 내면의 회복 자원은 든든히 작동하고 있습니다.';
    if (lastUserMsg.includes('쉬지') || lastUserMsg.includes('쉬고') || lastUserMsg.includes('휴식')) {
      contextualSummary = '온전히 쉬지 못했던 마음의 부담을 내려놓고, 나만의 안전한 쉼표를 허락해 주세요.';
    } else if (payload.scores.pssTotal >= 10) {
      contextualSummary = '과중했던 책임감의 무게를 잠시 덜어내고, 나를 위한 온전한 숨을 채울 시간입니다.';
    }

    return {
      id: `report_${Date.now()}`,
      createdAt: new Date().toISOString(),
      reportTitle: `${payload.selectedEmotions.slice(0, 2).join(' ')} 마음 뒤로 따뜻한 온기가 머무는 시간`,
      summarySentence: contextualSummary,
      psychologicalAnalysis: `선택하신 [${payload.selectedEmotions.join(', ')}] 감정과 스트레스 지수(${payload.scores.pssTotal}점 / 16점)를 종합해 볼 때, 심리적 에너지가 소진되어 몸과 마음에 휴식 신호가 켜진 상태입니다. 특히 '${payload.scores.lowestKRQDimension.label}' 영역이 취약해진 만큼, 혼자 모든 무게를 짊어지려 하기보다 작은 단위로 짐을 나누고 즉각적인 이완 요법을 실천하는 것이 큰 도움이 됩니다.`,
      riskLevel: payload.scores.pssTotal >= 11 ? '위험' : payload.scores.pssTotal >= 7 ? '주의' : '안전',
      actionPlans: [
        {
          type: 'immediate',
          categoryTag: '⚡ 3분 즉각 리셋',
          title: '3분 4-7-8 박스 이완 호흡',
          description: '코로 4초 숨을 들이마시고, 7초간 머무른 뒤, 8초간 입으로 길게 내쉬며 교감신경의 긴장을 내려놓습니다.',
          duration: '소요시간 3분',
        },
        {
          type: 'micro',
          categoryTag: '☕ 소소한 일상 힐링',
          title: '무자극 5분 시각 디톡스',
          description: '스마트폰과 모든 모니터를 끄고, 따뜻한 차 한 잔과 함께 창밖 먼 곳을 가만히 응시해 봅니다.',
          duration: '소요시간 5분',
        },
        {
          type: 'routine',
          categoryTag: '🌱 마음근육 데일리 루틴',
          title: `${payload.scores.lowestKRQDimension.label} 강화를 위한 마이크로 투두`,
          description: '오늘 해야 할 일 중 단 1가지를 의도적으로 내일로 넘겨보고, 죄책감 없이 나만의 저녁 시간을 가져보세요.',
          duration: '오늘 저녁',
        },
        {
          type: 'mindset',
          categoryTag: '💡 나를 위한 한마디',
          title: '지금 이대로도 충분히 애썼다는 자기 허용',
          description: '"완벽하게 해내지 않아도 괜찮아. 오늘 하루를 버텨낸 나 자신이 가장 대견해"라고 스스로에게 말해주세요.',
          duration: '언제든',
        },
      ],
      assessmentData: payload,
    };
  };

  // Handle Assessment Submission & Final Report Generation
  const handleSubmitAssessment = async (payload: AssessmentPayload) => {
    setAssessmentStage('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();

      const newReport: DiagnosisReport = {
        id: `report_${Date.now()}`,
        createdAt: new Date().toISOString(),
        reportTitle: result.reportTitle || '오늘의 마음 날씨 리포트',
        summarySentence: result.summarySentence || '마음의 쉼표가 필요한 하루입니다.',
        psychologicalAnalysis: result.psychologicalAnalysis || '데이터를 분석하여 따뜻한 위로를 전합니다.',
        riskLevel: result.riskLevel || (payload.scores.pssTotal >= 11 ? '위험' : payload.scores.pssTotal >= 7 ? '주의' : '안전'),
        actionPlans: result.actionPlans && result.actionPlans.length > 0 ? result.actionPlans : [
          {
            type: 'immediate',
            categoryTag: '⚡ 3분 즉각 리셋',
            title: '3분 4-7-8 박스 이완 호흡',
            description: '코로 4초 들이마시고, 7초 멈춘 뒤, 8초 동안 길게 내쉬며 긴장을 풀어줍니다.',
            duration: '소요시간 3분',
          },
          {
            type: 'routine',
            categoryTag: '🌱 마음근육 루틴',
            title: `${payload.scores.lowestKRQDimension.label} 회복을 위한 5분 저널링`,
            description: '오늘 나를 지켜준 작은 순간이나 스스로에게 해주고 싶은 격려 한 마디를 적어보세요.',
            duration: '매일 5분',
          },
        ],
        assessmentData: payload,
      };

      setActiveReport(newReport);
      setAssessmentStage('result');

      // Celebration effect
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399'],
      });
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('Analysis API error or timeout, generating instant clinical report:', error);
      const fallbackReport = createFallbackReport(payload);
      setActiveReport(fallbackReport);
      setAssessmentStage('result');
    }
  };

  const handleRetake = () => {
    setActiveReport(null);
    setPendingPayload(null);
    setAssessmentStage('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#1E293B] flex flex-col selection:bg-[#FBBF24] selection:text-[#1E293B]">
      {/* Top Sticky Header */}
      <Header
        onHomeClick={() => {
          if (assessmentStage === 'result' || assessmentStage === 'form' || assessmentStage === 'chat') {
            setAssessmentStage('landing');
            setActiveReport(null);
            setPendingPayload(null);
          }
        }}
        onOpenHotline={() => setShowHotlineModal(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col">
        {assessmentStage === 'landing' && (
          <LandingHero
            onStart={() => setAssessmentStage('form')}
          />
        )}

        {assessmentStage === 'form' && (
          <AssessmentForm
            onSubmit={handleProceedToChat}
            onCancel={() => setAssessmentStage('landing')}
          />
        )}

        {assessmentStage === 'chat' && pendingPayload && (
          <AICoachChat
            assessmentData={pendingPayload}
            onCompleteChat={handleSubmitAssessment}
            onCancelToForm={() => setAssessmentStage('form')}
          />
        )}

        {assessmentStage === 'loading' && (
          <LoadingAnalysis
            onForceComplete={() => {
              if (pendingPayload) {
                const fallbackReport = createFallbackReport(pendingPayload);
                setActiveReport(fallbackReport);
                setAssessmentStage('result');
              }
            }}
          />
        )}

        {assessmentStage === 'result' && activeReport && (
          <ReportDashboard
            report={activeReport}
            onRetake={handleRetake}
            onOpenBreathing={() => setShowBreathingModal(true)}
            onOpenHotline={() => setShowHotlineModal(true)}
          />
        )}
      </main>

      {/* Modals */}
      {showBreathingModal && (
        <BreathingModal onClose={() => setShowBreathingModal(false)} />
      )}

      {showHotlineModal && (
        <SafetyHotlineModal onClose={() => setShowHotlineModal(false)} />
      )}

      {/* Playful Geometric Footer */}
      <footer className="mt-auto py-8 px-4 sm:px-6 border-t-2 border-[#1E293B] bg-white text-center text-xs text-slate-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B]">
              <CloudSun className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="font-heading font-extrabold text-[#1E293B]">MindTracker - Inner Weather</span>
            <span className="font-bold text-slate-400">•</span>
            <span className="font-bold">마음 날씨 진단 및 멘탈 케어</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-bold">
            <span>Powered by Gemini 3.7 Flash</span>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setShowHotlineModal(true)}
              className="text-[#F472B6] hover:underline font-extrabold cursor-pointer"
            >
              24시 위기상담 안내
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

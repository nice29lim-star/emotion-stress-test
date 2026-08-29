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

  // Handle Assessment Submission & Final Report Generation
  const handleSubmitAssessment = async (payload: AssessmentPayload) => {
    setAssessmentStage('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

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
        riskLevel: result.riskLevel || '주의',
        actionPlans: result.actionPlans || [],
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
      console.error('Failed to analyze assessment with API:', error);
      // Construct friendly fallback report
      const fallbackReport: DiagnosisReport = {
        id: `report_${Date.now()}`,
        createdAt: new Date().toISOString(),
        reportTitle: '구름 낀 하늘 뒤로 온기가 머무는 시간',
        summarySentence: '조금 지쳐있더라도, 당신 내면의 회복 자원은 든든히 작동하고 있습니다.',
        psychologicalAnalysis: `선택하신 ${payload.selectedEmotions.join(', ')} 감정 상태와 PSS 스트레스 지수(${payload.scores.pssTotal}점)를 살펴볼 때, 심리적 피로감이 다소 누적된 상태입니다. 과중한 책임을 잠시 내려놓고 3분 안심 호흡과 ${payload.scores.lowestKRQDimension.label}을 북돋는 실천을 추천드립니다.`,
        riskLevel: payload.scores.pssTotal >= 11 ? '위험' : payload.scores.pssTotal >= 7 ? '주의' : '안전',
        actionPlans: [
          {
            type: 'immediate',
            title: '3분 4-7-8 박스 이완 호흡',
            description: '코로 4초 들이마시고, 7초간 멈춘 후, 8초간 입으로 천천히 내쉬며 굳은 몸의 긴장을 이완합니다.',
          },
          {
            type: 'routine',
            title: `${payload.scores.lowestKRQDimension.label} 보완을 위한 5분 저널링`,
            description: '오늘 나를 지지해 준 작은 순간 하나를 기록하고 스스로에게 따뜻한 칭찬 한 마디를 선물하세요.',
          },
        ],
        assessmentData: payload,
      };

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

        {assessmentStage === 'loading' && <LoadingAnalysis />}

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

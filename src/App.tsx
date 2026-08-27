import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { AssessmentForm } from './components/AssessmentForm';
import { LoadingAnalysis } from './components/LoadingAnalysis';
import { ReportDashboard } from './components/ReportDashboard';
import { HistoryDashboard } from './components/HistoryDashboard';
import { BreathingModal } from './components/BreathingModal';
import { SafetyHotlineModal } from './components/SafetyHotlineModal';
import { AssessmentPayload, DiagnosisReport, WellnessLog } from './types';
import { getSavedLogs, saveDiagnosisLog, deleteLog, seedDemoLogsIfEmpty } from './utils/storage';
import confetti from 'canvas-confetti';
import { CloudSun, Heart } from 'lucide-react';

export default function App() {
  // Navigation & view states
  const [currentTab, setCurrentTab] = useState<'assessment' | 'history' | 'breathing'>('assessment');
  const [assessmentStage, setAssessmentStage] = useState<'landing' | 'form' | 'loading' | 'result'>('landing');

  // Active Report
  const [activeReport, setActiveReport] = useState<DiagnosisReport | null>(null);

  // Saved Logs
  const [savedLogs, setSavedLogs] = useState<WellnessLog[]>([]);

  // Modals
  const [showBreathingModal, setShowBreathingModal] = useState<boolean>(false);
  const [showHotlineModal, setShowHotlineModal] = useState<boolean>(false);

  // Load saved history on mount
  useEffect(() => {
    const logs = seedDemoLogsIfEmpty();
    setSavedLogs(logs);
  }, []);

  // Handle Assessment Submission
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

      // Auto save to history
      const saved = saveDiagnosisLog(newReport, payload.userNotes);
      setSavedLogs(getSavedLogs());
      setActiveReport(newReport);
      setAssessmentStage('result');

      // Celebration effect
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#f43f5e', '#fbbf24'],
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

      saveDiagnosisLog(fallbackReport, payload.userNotes);
      setSavedLogs(getSavedLogs());
      setActiveReport(fallbackReport);
      setAssessmentStage('result');
    }
  };

  const handleRetake = () => {
    setActiveReport(null);
    setAssessmentStage('form');
    setCurrentTab('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPastLog = (report: DiagnosisReport) => {
    setActiveReport(report);
    setAssessmentStage('result');
    setCurrentTab('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteLog = (id: string) => {
    const updated = deleteLog(id);
    setSavedLogs(updated);
  };

  const handleSaveNoteToHistory = (note?: string) => {
    if (activeReport) {
      saveDiagnosisLog(activeReport, note);
      setSavedLogs(getSavedLogs());
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      {/* Top Sticky Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'breathing') {
            setShowBreathingModal(true);
          } else {
            setCurrentTab(tab);
            if (tab === 'assessment' && assessmentStage === 'result' && !activeReport) {
              setAssessmentStage('landing');
            }
          }
        }}
        onOpenHotline={() => setShowHotlineModal(true)}
        savedLogsCount={savedLogs.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'assessment' && (
          <>
            {assessmentStage === 'landing' && (
              <LandingHero
                onStart={() => setAssessmentStage('form')}
                onViewHistory={() => setCurrentTab('history')}
                recentLog={savedLogs[0]}
              />
            )}

            {assessmentStage === 'form' && (
              <AssessmentForm
                onSubmit={handleSubmitAssessment}
                onCancel={() => setAssessmentStage('landing')}
              />
            )}

            {assessmentStage === 'loading' && <LoadingAnalysis />}

            {assessmentStage === 'result' && activeReport && (
              <ReportDashboard
                report={activeReport}
                onRetake={handleRetake}
                onOpenBreathing={() => setShowBreathingModal(true)}
                onOpenHotline={() => setShowHotlineModal(true)}
                onSaveToHistory={handleSaveNoteToHistory}
              />
            )}
          </>
        )}

        {currentTab === 'history' && (
          <HistoryDashboard
            logs={savedLogs}
            onSelectLog={handleSelectPastLog}
            onDeleteLog={handleDeleteLog}
            onStartNewDiagnosis={() => {
              setCurrentTab('assessment');
              setAssessmentStage('form');
            }}
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

      {/* Subtle Warm Footer */}
      <footer className="mt-auto py-8 px-4 sm:px-6 border-t border-stone-200/60 bg-stone-100/40 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-teal-700" />
            <span className="font-semibold text-stone-700">MindTracker - Inner Weather</span>
            <span>• 마음 날씨 진단 및 멘탈 케어</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Google AI Studio Gemini 3.7 Flash</span>
            <span>•</span>
            <button
              onClick={() => setShowHotlineModal(true)}
              className="hover:text-rose-600 transition-colors underline underline-offset-2"
            >
              24시 위기상담 안내
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

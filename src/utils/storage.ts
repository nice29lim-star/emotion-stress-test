import { WellnessLog, DiagnosisReport } from '../types';

const STORAGE_KEY = 'mindtracker_wellness_logs_v1';

export function getSavedLogs(): WellnessLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load saved logs:', err);
    return [];
  }
}

export function saveDiagnosisLog(report: DiagnosisReport, userNotes?: string): WellnessLog {
  const logs = getSavedLogs();
  
  const emotions = report.assessmentData.selectedEmotions || [];
  const primaryEmotion = emotions[0] || '평온한';
  
  const newLog: WellnessLog = {
    id: report.id || `log_${Date.now()}`,
    date: new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }),
    timestamp: Date.now(),
    report,
    summaryWeather: report.reportTitle,
    primaryEmotion,
    stressScore: report.assessmentData.scores.pssTotal,
    resilienceScore: report.assessmentData.scores.krqScores.totalAverage,
    riskLevel: report.riskLevel,
    userNotes: userNotes || report.assessmentData.userNotes,
  };

  const updated = [newLog, ...logs];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save log to localStorage:', err);
  }
  return newLog;
}

export function deleteLog(id: string): WellnessLog[] {
  const logs = getSavedLogs();
  const filtered = logs.filter((l) => l.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete log:', err);
  }
  return filtered;
}

export function seedDemoLogsIfEmpty(): WellnessLog[] {
  const existing = getSavedLogs();
  if (existing.length > 0) return existing;

  const now = Date.now();
  const dayMs = 86400000;

  const demoLogs: WellnessLog[] = [
    {
      id: 'demo_1',
      date: new Date(now - dayMs * 3).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }),
      timestamp: now - dayMs * 3,
      summaryWeather: '흐린 구름 사이로 작은 빛줄기',
      primaryEmotion: '지친',
      stressScore: 9,
      resilienceScore: 3.2,
      riskLevel: '주의',
      userNotes: '주요 프로젝트 마감으로 피로감이 컸던 날. 그래도 팀원들과 대화로 환기함.',
      report: {
        id: 'demo_1',
        createdAt: new Date(now - dayMs * 3).toISOString(),
        reportTitle: '흐린 구름 사이로 작은 빛줄기',
        summarySentence: '에너지가 다소 소진되었으나 주변의 지지 자원이 든든한 날입니다.',
        psychologicalAnalysis: '과중한 업무로 인한 피로감이 누적되어 주의가 필요하지만, 대인관계 자원이 풍부하여 빠른 회복세를 보이고 있습니다.',
        riskLevel: '주의',
        actionPlans: [
          {
            type: 'immediate',
            title: '3분 온수 세안 및 어깨 스트레칭',
            description: '따뜻한 물로 얼굴을 가볍게 씻어내고 승모근을 천천히 5회 돌려줍니다.',
          },
          {
            type: 'routine',
            title: '수면 30분 전 스마트폰 멀리하기',
            description: '두뇌에 자극을 주는 화면을 끄고 편안한 수면 환경을 조성합니다.',
          },
        ],
        assessmentData: {
          selectedEmotions: ['지친', '예민한'],
          pssAnswers: { pss_q2: 3, pss_q3: 3, pss_q4: 2, pss_q5: 3 },
          krqAnswers: { krq_q6: 3, krq_q7: 4, krq_q8: 3, krq_q9: 3 },
          scores: {
            pssTotal: 9,
            pssLevel: '주의 (높음)',
            pssPercentage: 56,
            krqScores: {
              selfRegulation: 3,
              interpersonal: 4,
              positivity: 3,
              causeAnalysis: 3,
              totalAverage: 3.2,
            },
            lowestKRQDimension: {
              dimension: 'selfRegulation',
              label: '자기조절능력',
              score: 3,
            },
          },
          timestamp: new Date(now - dayMs * 3).toISOString(),
        },
      },
    },
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoLogs));
  } catch (e) {
    // Ignore error
  }
  return demoLogs;
}

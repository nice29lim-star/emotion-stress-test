export type WeatherEmotion = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  theme: 'amber' | 'blue' | 'purple' | 'emerald' | 'cyan' | 'rose';
};

export type PSSQuestionItem = {
  id: string;
  number: number;
  text: string;
  subtext?: string;
  isReversed?: boolean;
};

export type KRQDimension = 'selfRegulation' | 'interpersonal' | 'positivity' | 'causeAnalysis';

export type KRQQuestionItem = {
  id: string;
  number: number;
  text: string;
  dimension: KRQDimension;
  dimensionLabel: string;
  dimensionDescription: string;
};

export interface AssessmentScores {
  pssTotal: number; // 0 to 16
  pssLevel: '안정 (낮음)' | '보통 (적정)' | '주의 (높음)' | '경고 (매우 높음)';
  pssPercentage: number;
  krqScores: {
    selfRegulation: number; // 1-5
    interpersonal: number; // 1-5
    positivity: number; // 1-5
    causeAnalysis: number; // 1-5
    totalAverage: number; // 1-5
  };
  lowestKRQDimension: {
    dimension: KRQDimension;
    label: string;
    score: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export interface AssessmentPayload {
  selectedEmotions: string[];
  pssAnswers: Record<string, number>;
  krqAnswers: Record<string, number>;
  scores: AssessmentScores;
  userNotes?: string;
  chatHistory?: ChatMessage[];
  timestamp: string;
}

export interface ActionPlan {
  type: 'immediate' | 'routine';
  title: string;
  description: string;
}

export type RiskLevel = '안전' | '주의' | '위험';

export interface DiagnosisReport {
  id: string;
  createdAt: string;
  reportTitle: string;
  summarySentence: string;
  psychologicalAnalysis: string;
  riskLevel: RiskLevel;
  actionPlans: ActionPlan[];
  assessmentData: AssessmentPayload;
}

export interface WellnessLog {
  id: string;
  date: string;
  timestamp: number;
  report: DiagnosisReport;
  summaryWeather: string;
  primaryEmotion: string;
  stressScore: number;
  resilienceScore: number;
  riskLevel: RiskLevel;
  userNotes?: string;
}

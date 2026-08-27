import { WeatherEmotion, PSSQuestionItem, KRQQuestionItem, AssessmentScores, KRQDimension } from '../types';

export const EMOTIONS: WeatherEmotion[] = [
  {
    id: 'exhausted',
    emoji: '☁️',
    label: '지친',
    description: '에너지가 방전되고 무기력한 구름 낀 상태',
    theme: 'amber',
  },
  {
    id: 'depressed',
    emoji: '🌧️',
    label: '우울한',
    description: '마음에 차가운 비가 내리듯 가라앉은 기분',
    theme: 'blue',
  },
  {
    id: 'anxious',
    emoji: '🌪️',
    label: '불안한',
    description: '소용돌이치듯 생각과 걱정이 맴도는 상태',
    theme: 'purple',
  },
  {
    id: 'peaceful',
    emoji: '☀️',
    label: '평온한',
    description: '따스한 햇살처럼 온화하고 안정된 마음',
    theme: 'emerald',
  },
  {
    id: 'hopeful',
    emoji: '🌤️',
    label: '기대되는',
    description: '구름 사이로 햇살이 비추듯 설레는 희망',
    theme: 'cyan',
  },
  {
    id: 'sensitive',
    emoji: '⚡',
    label: '예민한',
    description: '작은 자극에도 번개처럼 신경이 곤두선 상태',
    theme: 'rose',
  },
];

export const PSS_OPTIONS = [
  { value: 0, label: '전혀 없다', scoreText: '0점' },
  { value: 1, label: '거의 없다', scoreText: '1점' },
  { value: 2, label: '가끔 있다', scoreText: '2점' },
  { value: 3, label: '자주 있다', scoreText: '3점' },
  { value: 4, label: '매우 자주 있다', scoreText: '4점' },
];

export const PSS_QUESTIONS: PSSQuestionItem[] = [
  {
    id: 'pss_q2',
    number: 2,
    text: '최근 한 달 동안, 예상치 못한 일 때문에 당황하거나 벅차다고 느낀 적이 있나요?',
    subtext: '돌발적인 사건이나 감당하기 어려운 일정으로 인한 압박감',
    isReversed: false,
  },
  {
    id: 'pss_q3',
    number: 3,
    text: '내가 감당해야 할 일들이 너무 많아서, 다 해내지 못할 것 같다는 생각이 들었나요?',
    subtext: '과도한 책임감과 업무/학업량에 대한 심리적 부담감',
    isReversed: false,
  },
  {
    id: 'pss_q4',
    number: 4,
    text: '내 마음대로 상황을 통제할 수 없어서 답답하거나 화가 난 적이 얼마나 자주 있었나요?',
    subtext: '통제력 상실감과 이로 인한 내면의 좌절감',
    isReversed: false,
  },
  {
    id: 'pss_q5',
    number: 5,
    text: '반대로, 개인적인 문제나 짜증 나는 일들을 내 뜻대로 잘 처리하며 넘긴 적은요?',
    subtext: '🌟 긍정적 대처 문항 (역채점 적용)',
    isReversed: true,
  },
];

export const KRQ_OPTIONS = [
  { value: 1, label: '전혀 그렇지 않다', scoreText: '1점' },
  { value: 2, label: '그렇지 않다', scoreText: '2점' },
  { value: 3, label: '보통이다', scoreText: '3점' },
  { value: 4, label: '그렇다', scoreText: '4점' },
  { value: 5, label: '매우 그렇다', scoreText: '5점' },
];

export const KRQ_QUESTIONS: KRQQuestionItem[] = [
  {
    id: 'krq_q6',
    number: 6,
    text: '기분이 크게 상하는 일이 생겨도, 나는 비교적 빨리 평정심을 되찾는 편이다.',
    dimension: 'selfRegulation',
    dimensionLabel: '자기조절능력',
    dimensionDescription: '감정적 충격 이후 평정심과 자제력을 회복하는 힘',
  },
  {
    id: 'krq_q7',
    number: 7,
    text: '힘들고 지칠 때, 내 마음을 털어놓고 의지할 수 있는 사람이 주변에 있다.',
    dimension: 'interpersonal',
    dimensionLabel: '대인관계능력',
    dimensionDescription: '심리적 안전망이 되는 지지 관계와 신뢰 네트워크',
  },
  {
    id: 'krq_q8',
    number: 8,
    text: '지금 당장은 힘들더라도, 결국 내 미래는 더 나아질 것이라는 믿음이 있다.',
    dimension: 'positivity',
    dimensionLabel: '긍정성 & 희망',
    dimensionDescription: '역경 속에서도 희망을 품고 삶의 의미를 발견하는 태도',
  },
  {
    id: 'krq_q9',
    number: 9,
    text: '어려운 문제에 부딪히면 감정적으로 무너지기보다, 어떻게 해결할지 원인을 찾는 편이다.',
    dimension: 'causeAnalysis',
    dimensionLabel: '원인분석력',
    dimensionDescription: '문제를 객관적으로 분해하고 단계적으로 해결하는 인지력',
  },
];

export function calculateScores(
  pssAnswers: Record<string, number>,
  krqAnswers: Record<string, number>
): AssessmentScores {
  // PSS Total (Max 16)
  // Q2, Q3, Q4 are direct (0-4)
  // Q5 is reversed: 4 - score
  const q2 = pssAnswers['pss_q2'] ?? 0;
  const q3 = pssAnswers['pss_q3'] ?? 0;
  const q4 = pssAnswers['pss_q4'] ?? 0;
  const q5Raw = pssAnswers['pss_q5'] ?? 0;
  const q5Adjusted = 4 - q5Raw;

  const pssTotal = Math.max(0, Math.min(16, q2 + q3 + q4 + q5Adjusted));
  const pssPercentage = Math.round((pssTotal / 16) * 100);

  let pssLevel: AssessmentScores['pssLevel'] = '안정 (낮음)';
  if (pssTotal >= 12) {
    pssLevel = '경고 (매우 높음)';
  } else if (pssTotal >= 8) {
    pssLevel = '주의 (높음)';
  } else if (pssTotal >= 4) {
    pssLevel = '보통 (적정)';
  } else {
    pssLevel = '안정 (낮음)';
  }

  // KRQ Scores (1-5 each)
  const selfReg = krqAnswers['krq_q6'] ?? 3;
  const interpers = krqAnswers['krq_q7'] ?? 3;
  const posit = krqAnswers['krq_q8'] ?? 3;
  const cause = krqAnswers['krq_q9'] ?? 3;
  const krqAvg = Number(((selfReg + interpers + posit + cause) / 4).toFixed(1));

  const dimensions: { dimension: KRQDimension; label: string; score: number }[] = [
    { dimension: 'selfRegulation', label: '자기조절능력', score: selfReg },
    { dimension: 'interpersonal', label: '대인관계능력', score: interpers },
    { dimension: 'positivity', label: '긍정성 & 희망', score: posit },
    { dimension: 'causeAnalysis', label: '원인분석력', score: cause },
  ];

  // Find lowest KRQ dimension
  dimensions.sort((a, b) => a.score - b.score);
  const lowestKRQDimension = dimensions[0];

  return {
    pssTotal,
    pssLevel,
    pssPercentage,
    krqScores: {
      selfRegulation: selfReg,
      interpersonal: interpers,
      positivity: posit,
      causeAnalysis: cause,
      totalAverage: krqAvg,
    },
    lowestKRQDimension,
  };
}

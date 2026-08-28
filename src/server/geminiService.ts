import { GoogleGenAI, Type } from '@google/genai';

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export const SYSTEM_PROMPT = `[Role]
당신은 임상심리학적 통찰력을 갖춘 전문적이고 따뜻한 멘탈 코치입니다.

[Task]
제공된 사용자의 '감정 상태', '스트레스 점수', '회복탄력성 점수'를 종합하여 심도 있는 진단과 구체적인 액션 플랜을 포함한 리포트를 작성하세요.

[Analysis Rule]
1. 스트레스가 높고 에너지가 낮으며 부정적 감정이 강할 경우: '에너지 고갈/번아웃 주의' 상태로 진단.
2. 회복탄력성 영역 중 가장 점수가 낮은 항목을 파악하여 맞춤형 루틴을 제안.
3. 말투는 공감적이고 부드러운 경어체를 사용하며, 비판하지 않습니다.

[Output Constraint]
반드시 다음 JSON 구조를 완벽하게 준수하여 응답하세요. 다른 텍스트는 포함하지 마세요.
{
  "reportTitle": "리포트 제목 (예: 잠시 멈춤이 필요한 시간)",
  "summarySentence": "상태를 요약하는 위로의 한 줄",
  "psychologicalAnalysis": "데이터를 종합한 현재 마음 상태 분석 (3~4문장)",
  "riskLevel": "안전/주의/위험",
  "actionPlans": [
    {
      "type": "immediate",
      "title": "지금 당장 할 수 있는 3분 액션",
      "description": "구체적인 방법"
    },
    {
      "type": "routine",
      "title": "마음 근육(회복탄력성)을 키우는 데일리 루틴",
      "description": "취약점을 보완하는 실천 방법"
    }
  ]
}`;

export function getFallbackReport(assessmentData: any) {
  const emotions: string[] = assessmentData.selectedEmotions || [];
  const pssTotal: number = assessmentData.scores?.pssTotal ?? 6;
  const lowestDimension = assessmentData.scores?.lowestKRQDimension?.label || '자기조절능력';

  let riskLevel: '안전' | '주의' | '위험' = '안전';
  let title = '맑은 햇살 속 잔잔한 휴식이 머무는 시간';
  let summary = '마음의 균형이 비교적 잘 유지되고 있으며, 작은 여유가 활력을 더해줄 것입니다.';
  let analysis = `현재 ${emotions.join(', ') || '복합적인'} 감정 상태를 경험하고 계십니다. 스트레스 부하는 비교적 안정적인 범위에 머물러 있어 일상의 과업을 차분하게 대처할 수 있는 여력이 있습니다. 다만 바쁜 일상 속에서 에너지가 서서히 소진되지 않도록 주기적인 마음 점검과 환기가 도움이 될 것입니다.`;

  if (pssTotal >= 11 || (emotions.includes('지친') && emotions.includes('우울한'))) {
    riskLevel = '위험';
    title = '마음의 소나기를 피하고 깊은 쉼이 필요한 순간';
    summary = '혼자서 모든 짐을 짊어지려 하지 마세요. 지금은 멈추어 서서 나를 돌볼 때입니다.';
    analysis = `최근 누적된 심리적 부담감과 ${emotions.join(', ') || '피로감'}으로 인해 마음의 에너지가 크게 소진된 상태입니다. 과중한 책임감이나 통제하기 어려운 상황들로 인해 번아웃 위험 신호가 감지됩니다. 지금 당장 모든 것을 완벽하게 해결하려 하기보다, 심리적 방어막을 세우고 가장 안전한 휴식을 취하는 것이 최우선입니다.`;
  } else if (pssTotal >= 6 || emotions.includes('지친') || emotions.includes('불안한') || emotions.includes('예민한')) {
    riskLevel = '주의';
    title = '흐린 구름 뒤로 따스한 쉼표를 건네는 시간';
    summary = '잠시 어깨의 긴장을 풀고, 내 마음이 보내는 작은 신호에 귀 기울여 주세요.';
    analysis = `일상적인 스트레스와 ${emotions.join(', ') || '긴장감'}이 다소 높아져 있어 신경이 곤두서거나 피로를 쉽게 느낄 수 있는 시기입니다. 다행히 내면의 회복 자원이 남아있어 적절한 완충 장치를 마련한다면 곧 안정감을 되찾을 수 있습니다. ${lowestDimension} 영역을 조금 더 보강하는 루틴을 실천해보세요.`;
  }

  return {
    reportTitle: title,
    summarySentence: summary,
    psychologicalAnalysis: analysis,
    riskLevel,
    actionPlans: [
      {
        type: 'immediate',
        title: '3분 4-7-8 박스 호흡 및 온기 느끼기',
        description: '편안히 앉아 4초간 코로 들이마시고, 7초간 멈춘 뒤, 8초간 입으로 천천히 내쉬며 뭉친 어깨와 목의 긴장을 풀어냅니다.',
      },
      {
        type: 'routine',
        title: `${lowestDimension} 강화를 위한 1일 1기록 리추얼`,
        description: `하루를 마무리하며 내 마음에 떠오르는 생각 3줄을 판단 없이 적고, 스스로에게 "오늘도 애썼어"라는 지지 문장을 선물해보세요.`,
      },
    ],
  };
}

export async function handleChatLogic(messages: any[], assessmentData: any) {
  const emotions = assessmentData?.selectedEmotions?.join(', ') || '복합적인 감정';
  const pssTotal = assessmentData?.scores?.pssTotal ?? 0;
  const pssLevel = assessmentData?.scores?.pssLevel || '보통';
  const lowestDimension = assessmentData?.scores?.lowestKRQDimension?.label || '자기조절능력';
  const userNotes = assessmentData?.userNotes ? `"${assessmentData.userNotes}"` : '없음';

  const COACH_SYSTEM_PROMPT = `당신은 사용자의 마음 날씨를 돌보는 따뜻하고 공감 가득한 AI 멘탈 케어 코치 '포미(Pomi, 마음구름)'입니다.

[사용자의 기본 진단 데이터]
- 감지된 감정: ${emotions}
- 스트레스 부하(PSS): 16점 만점 중 ${pssTotal}점 (${pssLevel})
- 회복탄력성 취약 영역: ${lowestDimension}
- 사용자가 진단 폼에서 남긴 한 줄 메모: ${userNotes}

[대화 및 상담 원칙]
1. 사용자의 마음 상태를 무조건적으로 수용하고 깊이 공감합니다.
2. 절대 훈계하거나 섣부른 조언을 길게 늘어놓지 않습니다.
3. 친절하고 다정한 경어체(따뜻한 대화체)를 사용합니다.
4. 한 번에 너무 길게 말하지 않고 2~3문장 내외로 자연스럽게 대화하세요. (공감 1~2문장 + 부담 없는 따뜻한 질문 1문장)
5. 사용자가 편안하게 마음속 이야기나 오늘 겪은 일, 감정의 원인을 털어놓을 수 있도록 안전한 대화 환경을 만들어주세요.`;

  const ai = getGeminiClient();

  if (ai) {
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction: COACH_SYSTEM_PROMPT,
        temperature: 0.8,
      },
    });

    return response.text?.trim() || '이야기해 주셔서 감사해요. 당신의 마음에 항상 귀 기울이고 있어요.';
  } else {
    const lastUserMsg = messages[messages.length - 1]?.content || '';
    let reply = '그렇게 느끼셨군요. 마음속에 담아두었던 생각을 들려주셔서 고마워요. 조금 더 편안하게 마음을 털어놓으셔도 괜찮아요.';
    
    if (lastUserMsg.includes('힘들') || lastUserMsg.includes('지쳐') || lastUserMsg.includes('피곤')) {
      reply = '오늘 하루 정말 많은 에너지를 쏟아내셨군요. 그동안 버텨온 것만으로도 충분히 애쓰셨어요. 지금 가장 쉬고 싶은 순간은 언제인가요?';
    } else if (lastUserMsg.includes('불안') || lastUserMsg.includes('걱정') || lastUserMsg.includes('어떡')) {
      reply = '마음속에 소용돌이치는 생각들 때문에 숨이 가빠질 때가 있죠. 지금은 아무것도 완벽히 해결하지 않아도 괜찮아요. 천천히 숨을 한번 들이마셔 볼까요?';
    } else if (lastUserMsg.includes('일') || lastUserMsg.includes('마감') || lastUserMsg.includes('과제')) {
      reply = '해야 할 일의 무게가 마음을 짓누르고 있었군요. 그 무게를 잠시 제게 덜어놓으세요. 조금씩 천천히 가도 괜찮습니다.';
    }

    return reply;
  }
}

export async function handleAnalyzeLogic(assessmentData: any) {
  const ai = getGeminiClient();

  if (ai) {
    let chatContext = 'AI와의 대화 내역 없음';
    if (assessmentData.chatHistory && assessmentData.chatHistory.length > 0) {
      chatContext = assessmentData.chatHistory
        .map((m: any) => `${m.role === 'user' ? '사용자' : 'AI코치'}: ${m.content}`)
        .join('\n');
    }

    const promptText = `사용자 마음 진단 데이터 및 AI 코치와의 대화 내용:
- 선택한 감정 단어: ${assessmentData.selectedEmotions?.join(', ') || '없음'}
- 스트레스 지수(PSS 총점 16점 만점): ${assessmentData.scores?.pssTotal}점 (${assessmentData.scores?.pssLevel})
- 회복탄력성 지수(KRQ 영역별 5점 척도):
  * 자기조절능력: ${assessmentData.scores?.krqScores?.selfRegulation}점
  * 대인관계능력: ${assessmentData.scores?.krqScores?.interpersonal}점
  * 긍정성 & 희망: ${assessmentData.scores?.krqScores?.positivity}점
  * 원인분석력: ${assessmentData.scores?.krqScores?.causeAnalysis}점
  * 가장 취약한 영역: ${assessmentData.scores?.lowestKRQDimension?.label} (${assessmentData.scores?.lowestKRQDimension?.score}점)
- 사용자가 남긴 한 줄 메모: "${assessmentData.userNotes || '메모 없음'}"

[AI 코치와의 실시간 대화 내역]:
${chatContext}

위 임상적 지표와 사용자가 대화에서 나눈 솔직한 고민/맥락을 종합 반영하여, System Instructions의 규칙에 맞춰 맞춤형 JSON 리포트를 생성해 주세요. 대화에서 언급된 구체적인 상황이나 마음을 분석에 자연스럽게 녹여내 주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reportTitle: {
              type: Type.STRING,
              description: '리포트 제목 (예: 잠시 멈춤이 필요한 시간)',
            },
            summarySentence: {
              type: Type.STRING,
              description: '상태를 요약하는 위로의 한 줄',
            },
            psychologicalAnalysis: {
              type: Type.STRING,
              description: '데이터를 종합한 현재 마음 상태 분석 (3~4문장)',
            },
            riskLevel: {
              type: Type.STRING,
              description: '안전, 주의, 위험 중 하나',
            },
            actionPlans: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    description: 'immediate 또는 routine',
                  },
                  title: {
                    type: Type.STRING,
                    description: '액션 플랜 제목',
                  },
                  description: {
                    type: Type.STRING,
                    description: '구체적인 실천 방법',
                  },
                },
                required: ['type', 'title', 'description'],
              },
            },
          },
          required: ['reportTitle', 'summarySentence', 'psychologicalAnalysis', 'riskLevel', 'actionPlans'],
        },
        temperature: 0.7,
      },
    });

    const text = response.text?.trim() || '';
    const parsedJson = JSON.parse(text);

    if (!['안전', '주의', '위험'].includes(parsedJson.riskLevel)) {
      parsedJson.riskLevel = assessmentData.scores?.pssTotal >= 11 ? '위험' : assessmentData.scores?.pssTotal >= 7 ? '주의' : '안전';
    }

    return parsedJson;
  } else {
    return getFallbackReport(assessmentData);
  }
}

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
당신은 임상심리학적 통찰력을 갖춘 전문적이고 따뜻한 멘탈 케어 코치입니다.

[Task]
제공된 사용자의 '감정 상태', '스트레스 점수(PSS)', '회복탄력성 점수(KRQ 4개 영역)' 및 'AI 코치와의 대화 내용'을 종합하여, 깊이 있는 진단과 **실생활에서 부담 없이 소소하게 실천할 수 있는 4가지 다채로운 맞춤형 액션 플랜**을 생성하세요.

[Action Plan Guidelines - 반드시 3~4개의 소소하고 구체적인 액션 제공]
액션 플랜은 거창하지 않고, 오늘 당장 쉽게 해볼 수 있는 작고 따뜻한 행동이어야 합니다.
1. 'immediate' (3분 즉각 리셋): 지금 당장 몸과 뇌의 긴장을 낮추는 신체/감각 액션 (예: 4-7-8 이완 호흡, 손바닥 온기 눈에 대기, 승모근/목 이완 스트레칭, 시원한 물 한 모금 천천히 넘기기)
2. 'micro' (소소한 일상 힐링): 1~2분 만에 기분을 환기하는 귀엽고 소소한 행동 (예: 30초간 창밖 먼 하늘 바라보기, 좋아하는 따뜻한 차 한 잔 끓이기, 오늘 해야 할 일 중 부담스러운 1개 과감히 내일로 미루기, 마음에 드는 음악 1곡 방해 없이 듣기)
3. 'routine' (회복탄력성 루틴): 사용자의 가장 취약한 회복탄력성 영역(자기조절/대인관계/긍정성/원인분석)을 일상 속에서 가볍게 채워주는 1일 1습관
4. 'mindset' (나를 위한 셀프 대화): 불안과 자책을 내려놓고 스스로에게 건네는 따뜻한 자기 친절(Self-compassion) 문장

[Output Constraint]
반드시 다음 JSON 구조를 완벽하게 준수하여 응답하세요.
{
  "reportTitle": "리포트 제목 (예: 지친 마음에 건네는 따스한 쉼표)",
  "summarySentence": "마음을 다독이는 따뜻한 핵심 위로 한 줄",
  "psychologicalAnalysis": "데이터와 대화 맥락을 종합한 심리 상태 분석 (3~4문장)",
  "riskLevel": "안전/주의/위험",
  "actionPlans": [
    {
      "type": "immediate",
      "categoryTag": "⚡ 3분 즉각 리셋",
      "title": "구체적인 제목",
      "description": "쉽고 친절한 실천 가이드",
      "duration": "소요시간 3분"
    },
    {
      "type": "micro",
      "categoryTag": "☕ 소소한 일상 힐링",
      "title": "구체적인 제목",
      "description": "쉽고 친절한 실천 가이드",
      "duration": "소요시간 1분"
    },
    {
      "type": "routine",
      "categoryTag": "🌱 마음근육 데일리 루틴",
      "title": "취약 회복탄력성 영역 보완 루틴",
      "description": "쉽고 친절한 실천 가이드",
      "duration": "매일 3분"
    },
    {
      "type": "mindset",
      "categoryTag": "💡 나를 위한 한마디",
      "title": "마인드셋 리프레이밍",
      "description": "마음속으로 되뇌어 볼 따뜻한 확언과 관점 전환",
      "duration": "언제든"
    }
  ]
}`;

export function getFallbackReport(assessmentData: any) {
  const emotions: string[] = assessmentData.selectedEmotions || [];
  const pssTotal: number = assessmentData.scores?.pssTotal ?? 6;
  const lowestDimension = assessmentData.scores?.lowestKRQDimension?.label || '자기조절능력';

  let riskLevel: '안전' | '주의' | '위험' = '안전';
  let title = '맑은 햇살 속 잔잔한 휴식이 머무는 시간';
  let summary = '마음의 균형이 비교적 잘 유지되고 있으며, 소소한 쉼이 일상의 활력을 더해줄 것입니다.';
  let analysis = `현재 ${emotions.join(', ') || '복합적인'} 감정 상태를 경험하고 계십니다. 스트레스 부하는 비교적 안정적인 범위에 머물러 있어 일상의 과업을 차분하게 대처할 수 있는 여력이 있습니다. 다만 바쁜 일상 속에서 에너지가 서서히 소진되지 않도록 주기적인 마음 점검과 환기가 도움이 될 것입니다.`;

  let immediateTitle = '3분 4-7-8 박스 호흡 및 온기 느끼기';
  let immediateDesc = '편안히 앉아 4초간 코로 숨을 들이마시고, 7초간 멈춘 뒤, 8초간 입으로 천천히 내쉬며 뭉친 어깨와 목의 긴장을 부드럽게 풀어냅니다.';
  let microTitle = '창밖 30초 바라보며 어깨 털어내기';
  let microDesc = '스마트폰 화면에서 잠시 눈을 떼고, 창밖 가장 먼 풍경을 30초 동안 멍하니 바라보며 숨을 깊게 내쉬어보세요.';
  let routineTitle = `${lowestDimension} 강화를 위한 1일 1기록 리추얼`;
  let routineDesc = `하루를 마무리하며 마음에 떠오른 칭찬할 점 1가지와 오늘 하루 고마웠던 순간 1가지를 짧게 메모장에 적어보세요.`;
  let mindsetTitle = '"오늘의 속도로도 충분해" 셀프 허용하기';
  let mindsetDesc = '남들과 비교하거나 완벽을 강요하는 생각이 들 때, "지금 내가 할 수 있는 만큼만 해도 충분히 훌륭해"라고 소리 내어 말해주세요.';

  if (pssTotal >= 11 || (emotions.includes('지친') && emotions.includes('우울한'))) {
    riskLevel = '위험';
    title = '마음의 소나기를 피하고 깊은 쉼이 필요한 순간';
    summary = '혼자서 모든 짐을 짊어지려 하지 마세요. 지금은 멈추어 서서 나를 돌볼 때입니다.';
    analysis = `최근 누적된 심리적 부담감과 ${emotions.join(', ') || '피로감'}으로 인해 마음의 에너지가 크게 소진된 상태입니다. 과중한 책임감이나 통제하기 어려운 상황들로 인해 번아웃 위험 신호가 감지됩니다. 지금 당장 모든 것을 완벽하게 해결하려 하기보다, 심리적 방어막을 세우고 가장 안전한 휴식을 취하는 것이 최우선입니다.`;
    
    immediateTitle = '손바닥 비벼 따뜻한 온기로 눈 감싸기';
    immediateDesc = '두 손을 10초간 빠르게 비벼 열감을 만든 후, 살포시 눈 위에 얹고 어둠 속에서 3번 깊게 심호흡합니다. 지친 시신경과 뇌가 빠르게 이완됩니다.';
    microTitle = '오늘 해야 할 일 중 1개 과감히 내일로 미루기';
    microDesc = '오늘 당장 세상이 끝나지 않는 일 목록 하나를 골라 "이건 내일의 나에게 맡긴다"고 선언하고 체크리스트에서 지워보세요.';
    routineTitle = '취침 전 5분 디지털 디톡스 & 따뜻한 물 한 잔';
    routineDesc = '잠들기 30분 전 스마트폰을 멀리 두고, 미지근한 물이나 디카페인 차를 천천히 마시며 수면의 질을 보호합니다.';
    mindsetTitle = '"모든 것을 다 감당하지 않아도 괜찮아"';
    mindsetDesc = '책임감의 무게에 짓눌릴 때마다 "지금은 내 마음의 회복이 가장 우선순위야"라며 나에게 쉼을 선물하세요.';
  } else if (pssTotal >= 6 || emotions.includes('지친') || emotions.includes('불안한') || emotions.includes('예민한')) {
    riskLevel = '주의';
    title = '흐린 구름 뒤로 따스한 쉼표를 건네는 시간';
    summary = '잠시 어깨의 긴장을 풀고, 내 마음이 보내는 작은 신호에 귀 기울여 주세요.';
    analysis = `일상적인 스트레스와 ${emotions.join(', ') || '긴장감'}이 다소 높아져 있어 신경이 곤두서거나 피로를 쉽게 느낄 수 있는 시기입니다. 다행히 내면의 회복 자원이 남아있어 적절한 완충 장치를 마련한다면 곧 안정감을 되찾을 수 있습니다. ${lowestDimension} 영역을 조금 더 보강하는 루틴을 실천해보세요.`;
    
    immediateTitle = '승모근 으쓱 스트레칭 3회';
    immediateDesc = '숨을 들이마시며 양 어깨를 귀까지 바짝 끌어올렸다가, 숨을 "후-" 뱉으며 어깨를 툭 떨어뜨리는 동작을 3회 반복합니다.';
    microTitle = '좋아하는 음악 1곡 온전히 몰입해 듣기';
    microDesc = '다른 작업을 멈추고 오직 음악의 선율과 리듬에만 귀를 기울여 3분 동안 뇌에 신선한 휴식을 선물합니다.';
    routineTitle = `${lowestDimension} 충전을 위한 감정 라벨링 1줄 메모`;
    routineDesc = '답답한 마음이 들 때 "지금 나는 OO해서 불안하구나"라고 감정에 이름을 붙여 객관화하는 연습을 합니다.';
    mindsetTitle = '"생각은 구름처럼 흘러갈 뿐이야"';
    mindsetDesc = '꼬리를 무는 걱정이 떠오를 때, 그 생각을 사실로 믿지 말고 하늘을 지나가는 구름처럼 그저 바라보고 흘려보내세요.';
  }

  return {
    reportTitle: title,
    summarySentence: summary,
    psychologicalAnalysis: analysis,
    riskLevel,
    actionPlans: [
      {
        type: 'immediate',
        categoryTag: '⚡ 3분 즉각 리셋',
        title: immediateTitle,
        description: immediateDesc,
        duration: '소요시간 3분',
      },
      {
        type: 'micro',
        categoryTag: '☕ 소소한 일상 힐링',
        title: microTitle,
        description: microDesc,
        duration: '소요시간 1분',
      },
      {
        type: 'routine',
        categoryTag: '🌱 마음근육 데일리 루틴',
        title: routineTitle,
        description: routineDesc,
        duration: '매일 3분',
      },
      {
        type: 'mindset',
        categoryTag: '💡 나를 위한 한마디',
        title: mindsetTitle,
        description: mindsetDesc,
        duration: '언제든',
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
3. 친절하고 다정한 경어체(따뜻하고 부드러운 대화체)를 사용합니다.
4. 한 번에 너무 길게 말하지 않고 2~3문장 내외로 자연스럽게 대화하세요. (깊은 공감 1~2문장 + 부담 없는 따뜻한 질문 또는 위로 1문장)
5. 사용자가 편안하게 마음속 이야기나 오늘 겪은 일, 감정의 원인을 털어놓을 수 있도록 안전하고 온화한 분위기를 만들어주세요.`;

  const ai = getGeminiClient();

  if (ai) {
    // Format messages for Gemini multiturn: MUST start with 'user' and alternate roles
    const rawContents: { role: string; parts: { text: string }[] }[] = [];
    
    // Initial synthetic context so the conversation starts with user turn
    rawContents.push({
      role: 'user',
      parts: [{ text: `안녕하세요 포미. 오늘 제 마음 진단 결과(감정: ${emotions}, 스트레스: ${pssTotal}점, 취약영역: ${lowestDimension})를 바탕으로 대화를 시작하고 싶어요.` }],
    });

    for (const m of messages) {
      if (!m || !m.content) continue;
      const role = m.role === 'assistant' ? 'model' : 'user';
      const last = rawContents[rawContents.length - 1];

      if (last && last.role === role) {
        // Merge consecutive messages of same role
        last.parts[0].text += `\n${m.content}`;
      } else {
        rawContents.push({
          role,
          parts: [{ text: m.content }],
        });
      }
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: rawContents,
        config: {
          systemInstruction: COACH_SYSTEM_PROMPT,
          temperature: 0.8,
        },
      });

      return response.text?.trim() || '이야기해 주셔서 감사해요. 당신의 마음에 항상 귀 기울이고 있어요.';
    } catch (err: any) {
      console.warn('gemini-3.7-flash chat error, trying gemini-2.5-flash fallback:', err?.message);
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: rawContents,
          config: {
            systemInstruction: COACH_SYSTEM_PROMPT,
            temperature: 0.8,
          },
        });
        return response.text?.trim() || '이야기해 주셔서 감사해요. 당신의 마음에 항상 귀 기울이고 있어요.';
      } catch (fallbackErr) {
        console.error('All Gemini chat models failed, using intelligent rule reply:', fallbackErr);
        return getHeuristicChatReply(messages);
      }
    }
  } else {
    return getHeuristicChatReply(messages);
  }
}

export function getHeuristicChatReply(messages: any[]) {
  const lastUserMsg = messages.filter((m: any) => m.role === 'user').slice(-1)[0]?.content || '';
  
  if (lastUserMsg.includes('대견') || lastUserMsg.includes('뿌듯') || lastUserMsg.includes('잘') || lastUserMsg.includes('칭찬')) {
    return '스스로를 대견하게 바라보는 그 따뜻한 마음이 정말 빛나요! 힘든 일정 속에서도 꿋꿋하게 해낸 자신에게 오늘 밤 작은 포상이나 푹 쉴 수 있는 시간을 선물해 주는 건 어떨까요? ✨';
  }
  if (lastUserMsg.includes('힘들') || lastUserMsg.includes('지쳐') || lastUserMsg.includes('피곤') || lastUserMsg.includes('번아웃')) {
    return '오늘 하루 정말 많은 에너지를 쏟아내셨군요. 그동안 버텨온 것만으로도 충분히 애쓰셨어요. 지금 가장 쉬고 싶은 순간은 언제인가요? 🛋️';
  }
  if (lastUserMsg.includes('불안') || lastUserMsg.includes('걱정') || lastUserMsg.includes('어떡') || lastUserMsg.includes('조급')) {
    return '마음속에 소용돌이치는 생각들 때문에 숨이 가빠질 때가 있죠. 지금은 아무것도 완벽히 해결하지 않아도 괜찮아요. 천천히 숨을 한번 깊게 들이마셔 볼까요? 🌿';
  }
  if (lastUserMsg.includes('일') || lastUserMsg.includes('마감') || lastUserMsg.includes('과제') || lastUserMsg.includes('회사')) {
    return '해야 할 일의 무게가 마음을 짓누르고 있었군요. 그 무게를 잠시 제게 덜어놓으세요. 조금씩 천천히 가도 괜찮습니다. ☕';
  }

  return '마음속에 담아두었던 솔직한 이야기를 들려주셔서 고마워요. 어떤 감정이든 편안하게 털어놓으셔도 괜찮아요. 또 다른 생각이나 전하고 싶은 마음이 있으신가요? 🌤️';
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

    const generateConfig = {
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
                  description: 'immediate, micro, routine, mindset 중 하나',
                },
                categoryTag: {
                  type: Type.STRING,
                  description: '예: ⚡ 3분 즉각 리셋, ☕ 소소한 일상 힐링, 🌱 마음근육 데일리 루틴, 💡 나를 위한 한마디',
                },
                title: {
                  type: Type.STRING,
                  description: '소소하고 구체적인 액션 플랜 제목',
                },
                description: {
                  type: Type.STRING,
                  description: '쉽고 따뜻한 실천 방법 가이드',
                },
                duration: {
                  type: Type.STRING,
                  description: '소요 시간 (예: 소요시간 3분, 1분, 매일 3분, 언제든)',
                },
              },
              required: ['type', 'categoryTag', 'title', 'description', 'duration'],
            },
          },
        },
        required: ['reportTitle', 'summarySentence', 'psychologicalAnalysis', 'riskLevel', 'actionPlans'],
      },
      temperature: 0.7,
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: promptText,
        config: generateConfig,
      });
    } catch (err: any) {
      console.warn('gemini-3.7-flash analyze error, trying gemini-2.5-flash fallback:', err?.message);
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptText,
          config: generateConfig,
        });
      } catch (fallbackErr) {
        console.error('All Gemini analyze models failed, using heuristic engine:', fallbackErr);
        return getFallbackReport(assessmentData);
      }
    }

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

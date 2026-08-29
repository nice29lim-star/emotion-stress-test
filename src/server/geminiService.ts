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

  const userMessages = messages.filter((m: any) => m.role === 'user');
  const userTurnCount = userMessages.length;

  const COACH_SYSTEM_PROMPT = `당신은 사용자의 마음 날씨를 돌보는 가장 따뜻하고 지혜로운 AI 멘탈 케어 단짝 친구 '포미(Pomi, 마음구름)'입니다.

[사용자의 진단 데이터]
- 감정 상태: ${emotions}
- 스트레스 부하: ${pssTotal}점 / 16점 만점 (${pssLevel})
- 회복탄력성 취약 영역: ${lowestDimension}
- 진단 메모: ${userNotes}
- 현재 대화 진행: ${userTurnCount}번째 턴

[대화 원칙 - 진정한 친구 같은 티키타카]
1. 사용자가 방금 한 말의 구체적인 상황과 숨은 감정(예: '쉬고 싶은데 쉬지 못하는 죄책감/조급함', '인간관계의 상처', '일에 대한 압박' 등)을 정확히 포착하여 깊이 공감해주세요.
2. 형식적인 앵무새식 인사("이야기를 들려주셔서 고마워요")를 매번 반복하지 마세요! 대화의 맥락을 이어가며 친구처럼 자연스럽게 끄덕이고 답해주세요.
3. 말투: 다정하고 포근한 어투(부드러운 경어체 또는 따뜻한 반존댓말 느낌).
4. 길이: 2~4문장으로 읽기 편안하게 (진심 어린 공감과 맞장구 + 편안하게 생각해보거나 쉬어갈 수 있는 질문 또는 따뜻한 위로 1문장).
5. 턴 수에 따른 흐름:
   - 1~6턴: 사용자의 마음속 이야기를 깊이 경청하고 원인과 감정을 함께 탐색하기.
   - 7~10턴 이상: 충분히 교감한 후, 지금까지 나눈 이야기를 따뜻하게 매듭지으며 "오늘 저에게 털어놓아 주신 마음들을 잘 담아두었어요. 지금까지 나눈 이야기들을 바탕으로 맞춤 마음 리포트를 확인해 보시는 건 어떨까요? 📝✨" 하고 자연스럽게 리포트 확인을 다정하게 제안하기.`;

  const ai = getGeminiClient();

  if (ai) {
    // Format messages for Gemini multiturn: MUST start with 'user' and alternate roles
    const rawContents: { role: string; parts: { text: string }[] }[] = [];
    
    // Initial synthetic context so the conversation starts with user turn
    rawContents.push({
      role: 'user',
      parts: [{ text: `안녕하세요 포미. 오늘 제 마음 진단 결과(감정: ${emotions}, 스트레스: ${pssTotal}점, 취약영역: ${lowestDimension})를 바탕으로 편안하게 이야기 나누고 싶어요.` }],
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

    // Helper for fast non-blocking timeout under high concurrency
    const callChatWithTimeout = async (modelName: string, timeoutMs = 6000) => {
      const callPromise = ai.models.generateContent({
        model: modelName,
        contents: rawContents,
        config: {
          systemInstruction: COACH_SYSTEM_PROMPT,
          temperature: 0.8,
        },
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Chat Timeout ${modelName}`)), timeoutMs)
      );
      return Promise.race([callPromise, timeoutPromise]);
    };

    // Try gemini-2.5-flash first for ultra-fast, reliable and warm conversation, then gemini-3.7-flash
    try {
      const response = await callChatWithTimeout('gemini-2.5-flash', 6000);
      if (response.text?.trim()) {
        return response.text.trim();
      }
    } catch (err: any) {
      console.warn('gemini-2.5-flash chat error/timeout, trying gemini-3.7-flash fallback:', err?.message);
      try {
        const response = await callChatWithTimeout('gemini-3.7-flash', 6000);
        if (response.text?.trim()) {
          return response.text.trim();
        }
      } catch (fallbackErr) {
        console.warn('Gemini chat models congested during multi-user peak, using instant empathetic engine:', fallbackErr);
        return getHeuristicChatReply(messages);
      }
    }

    return getHeuristicChatReply(messages);
  } else {
    return getHeuristicChatReply(messages);
  }
}

export function getHeuristicChatReply(messages: any[]) {
  const userMessages = messages.filter((m: any) => m.role === 'user');
  const lastUserMsg = userMessages.slice(-1)[0]?.content || '';
  const turnCount = userMessages.length;

  if (turnCount >= 8) {
    return `오늘 저와 마음속 깊은 이야기들을 솔직하게 나누어 주셔서 정말 고마워요. 🌸\n\n대화를 나누며 스스로를 돌아보는 것만으로도 마음의 무게가 조금은 가벼워지셨기를 바라요. 지금까지 나눈 이야기들을 토대로 맞춤형 멘탈 케어 리포트를 확인해 보시는 건 어떨까요? 언제든 상단의 **'리포트 생성하기'**를 눌러주세요! ✨`;
  }

  if (lastUserMsg.includes('쉬지') || lastUserMsg.includes('쉬고') || lastUserMsg.includes('쉬질') || lastUserMsg.includes('휴식')) {
    const replies = [
      '쉬고 싶은 마음이 간절한데도 몸이나 마음이 멈추지 못할 때, 그 답답함과 죄책감이 정말 크죠. 혹시 마음 한구석에서 "지금 쉬면 안 돼"라며 스스로를 재촉하고 있는 건 아닐까요? 🥺',
      '쉬는 것조차 마음 편히 허락되지 않는 상황이군요... 온전히 쉬지 못하게 가로막는 생각이나 해야 할 일들이 어떤 것인지 조금 더 털어놓아 주실 수 있나요? ☕',
      '충분히 쉴 자격이 있는데도 멈추기가 참 어렵죠. 오늘 딱 10분만이라도 세상의 모든 알림을 끄고 오직 숨만 쉬는 시간을 스스로에게 허락해 주는 건 어떨까요? 🌿',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  if (lastUserMsg.includes('대견') || lastUserMsg.includes('뿌듯') || lastUserMsg.includes('잘') || lastUserMsg.includes('칭찬') || lastUserMsg.includes('소화')) {
    const replies = [
      '스스로를 대견하게 바라보는 그 따뜻한 시선이 정말 반짝여요! ✨ 벅찬 일정 속에서도 도망치지 않고 버텨낸 스스로에게 오늘 밤 가장 포근한 쉼을 선물해 주세요.',
      '맞아요! 남들은 몰라도 내가 얼마나 애썼는지는 내가 가장 잘 알잖아요. 그런 나를 꼭 안아주고 칭찬해 주는 당신의 마음근육이 참 단단해요. 💛',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  if (lastUserMsg.includes('힘들') || lastUserMsg.includes('지쳐') || lastUserMsg.includes('피곤') || lastUserMsg.includes('버거') || lastUserMsg.includes('번아웃')) {
    const replies = [
      '오늘 하루 정말 많은 에너지를 쏟아내셨군요. 그동안 묵묵히 버텨온 것만으로도 충분히 애쓰셨어요. 지금 가장 덜어내고 싶은 짐은 무엇인가요? 🛋️',
      '몸도 마음도 배터리가 깜빡이고 있는 상태군요. 지금 당장은 아무것도 완벽히 해내지 않아도 괜찮아요. 제 곁에서 잠시 편안하게 기대어 쉬어가세요. ☁️',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  if (lastUserMsg.includes('불안') || lastUserMsg.includes('걱정') || lastUserMsg.includes('어떡') || lastUserMsg.includes('조급') || lastUserMsg.includes('두려')) {
    const replies = [
      '마음속에 소용돌이치는 생각들 때문에 숨이 가빠질 때가 있죠. 지금 느끼는 불안은 당신이 이 일을 소중하게 생각하고 있다는 증거이기도 해요. 천천히 숨을 깊게 내쉬어 볼까요? 🌿',
      '아직 일어나지 않은 일에 대한 걱정들이 마음을 가득 채우고 있군요. 그 걱정의 구름을 잠시 머리 위에 띄워두고, 지금 이 순간의 안전한 감각에 집중해 보아요. 🌤️',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  if (lastUserMsg.includes('일') || lastUserMsg.includes('마감') || lastUserMsg.includes('과제') || lastUserMsg.includes('회사') || lastUserMsg.includes('공부') || lastUserMsg.includes('야근')) {
    const replies = [
      '해야 할 일의 무게가 끝없이 어깨를 짓누르고 있었군요. 그 무거운 짐을 잠시 제게 덜어놓으세요. 조금씩 천천히 가도 괜찮습니다. ☕',
      '세상 모든 일을 혼자 다 짊어지려 하지 않아도 돼요. 오늘 할 일 중 딱 하나만 내일로 미뤄보는 작은 용기를 내보는 건 어떨까요? 🍃',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  if (lastUserMsg.includes('사람') || lastUserMsg.includes('친구') || lastUserMsg.includes('상사') || lastUserMsg.includes('가족') || lastUserMsg.includes('관계') || lastUserMsg.includes('눈치')) {
    return '사람과의 관계에서 오는 피로감은 마음에 정말 깊은 생채기를 남기죠. 다른 사람들의 기대나 시선보다 지금은 내 마음의 평화가 가장 소중해요. 어떤 상황이 특히 마음을 힘들게 했나요? 🤍';
  }

  const generalReplies = [
    '그렇게 느끼셨군요... 마음속 깊은 곳에 있는 생각을 솔직하게 꺼내어 말씀해 주셔서 진심으로 고마워요. 그 감정에 대해 조금 더 이야기해 주실 수 있나요? 🌤️',
    '마음속에 떠오른 그 생각들이 참 많은 의미를 담고 있네요. 편안하게 어떤 이야기든 털어놓아 주세요, 제가 곁에서 따뜻하게 귀 기울이고 있을게요. 🌿',
    '이야기를 들으니 그동안 혼자 마음고생이 많으셨을 것 같아요. 언제든 당신 편에서 응원하고 지지할게요. 또 마음에 걸리는 부분이 있다면 편히 말씀해 주세요. 💛',
  ];

  return generalReplies[Math.floor(Math.random() * generalReplies.length)];
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

    let responseText = '';
    
    // Helper with timeout
    const callModelWithTimeout = async (modelName: string, timeoutMs = 8000) => {
      const callPromise = ai.models.generateContent({
        model: modelName,
        contents: promptText,
        config: generateConfig,
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout ${modelName}`)), timeoutMs)
      );
      return Promise.race([callPromise, timeoutPromise]);
    };

    try {
      // Try gemini-2.5-flash first (fast & reliable JSON schema response)
      const res = await callModelWithTimeout('gemini-2.5-flash', 8000);
      responseText = res.text?.trim() || '';
    } catch (err: any) {
      console.warn('gemini-2.5-flash analyze error, trying gemini-3.7-flash:', err?.message);
      try {
        const res = await callModelWithTimeout('gemini-3.7-flash', 8000);
        responseText = res.text?.trim() || '';
      } catch (fallbackErr) {
        console.error('All Gemini models timed out or failed in analyze, generating smart clinical report:', fallbackErr);
        return getFallbackReport(assessmentData);
      }
    }

    try {
      let cleaned = responseText;
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsedJson = JSON.parse(cleaned);

      if (!['안전', '주의', '위험'].includes(parsedJson.riskLevel)) {
        parsedJson.riskLevel = assessmentData.scores?.pssTotal >= 11 ? '위험' : assessmentData.scores?.pssTotal >= 7 ? '주의' : '안전';
      }

      return parsedJson;
    } catch (parseError) {
      console.error('JSON parsing failed on analyze response, returning clinical fallback report:', parseError);
      return getFallbackReport(assessmentData);
    }
  } else {
    return getFallbackReport(assessmentData);
  }
}

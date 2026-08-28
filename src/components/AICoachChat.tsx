import React, { useState, useEffect, useRef } from 'react';
import { AssessmentPayload, ChatMessage } from '../types';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Heart,
  MessageCircle,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  CloudSun,
  Smile,
  Edit3,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AICoachChatProps {
  assessmentData: AssessmentPayload;
  onCompleteChat: (updatedPayload: AssessmentPayload) => void;
  onCancelToForm: () => void;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({
  assessmentData,
  onCompleteChat,
  onCancelToForm,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Quick suggestion chips based on assessment
  const emotions = assessmentData.selectedEmotions;
  const pssScore = assessmentData.scores.pssTotal;
  const userNote = assessmentData.userNotes;

  const quickReplies = [
    '오늘 유독 집중하기 힘들고 피로가 심해요 ☁️',
    '해야 할 일이 산더미인데 마음만 조급해요 ⏳',
    '주변 사람들의 기대나 시선이 부담스러워요 🌿',
    '그냥 아무 생각 없이 푹 쉬고 싶어요 🛋️',
    '마음이 가라앉아서 따뜻한 위로가 필요해요 ☕',
  ];

  // Initialize opening greeting from AI Coach '포미(Pomi)'
  useEffect(() => {
    const emotionStr = emotions.join(', ');
    const noteSnippet = userNote ? ` "${userNote}"라고 남겨주신 메모를 읽으며 마음이 많이 쓰였어요.` : '';
    
    let introGreeting = `안녕하세요! 저는 당신의 마음 날씨 친구이자 멘탈 코치 **포미(Pomi)**예요. 🌤️\n\n오늘 마음에 **'${emotionStr}'** 기운이 맴돌고 계시군요.${noteSnippet}\n\n지금 마음을 무겁게 짓누르고 있거나 털어놓고 싶은 이야기가 있다면 무엇이든 편하게 들려주세요. 제가 온전히 곁에서 들어드릴게요.`;

    if (emotions.includes('평온한') || emotions.includes('기대되는')) {
      introGreeting = `안녕하세요! 마음 날씨 친구 **포미(Pomi)**예요. ☀️\n\n오늘 마음에 **'${emotionStr}'** 따스한 햇살이 비추고 있어 정말 다행이에요!${noteSnippet}\n\n오늘 당신의 기분을 밝게 밝혀준 특별한 순간이나 스스로에게 해주고 싶은 칭찬이 있나요? 편하게 이야기 들려주세요!`;
    }

    const initialMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: introGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialMsg]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          assessmentData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get chat response');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        role: 'assistant',
        content: data.reply || '마음속 이야기를 나누어 주셔서 진심으로 고마워요.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        role: 'assistant',
        content: '마음속에 품고 있던 무거운 짐을 솔직하게 꺼내어 말씀해 주셔서 감사해요. 당신의 모든 감정은 그 자체로 충분히 타당하고 소중합니다.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Generate Report with chat history
  const handleFinishAndGenerateReport = () => {
    const updatedPayload: AssessmentPayload = {
      ...assessmentData,
      chatHistory: messages,
    };
    onCompleteChat(updatedPayload);
  };

  const userMessagesCount = messages.filter((m) => m.role === 'user').length;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 flex flex-col min-h-[calc(100vh-140px)]">
      {/* Top Banner: Coach Identity Card */}
      <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-5 sm:p-6 shadow-pop-card mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Animated Mascot Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B] shadow-pop-sm">
              <CloudSun className="w-7 h-7 stroke-[2.5] animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#34D399] border-2 border-[#1E293B] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#1E293B]">
                마음 날씨 친구 포미 (Pomi)
              </h2>
              <span className="px-3 py-1 rounded-full bg-[#8B5CF6] text-white border-2 border-[#1E293B] text-xs font-bold flex items-center gap-1 shadow-pop-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI 공감 대화</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              입력하신 감정과 스트레스 데이터를 바탕으로 1:1 맞춤 대화를 나눕니다.
            </p>
          </div>
        </div>

        {/* Generate Report Quick Button in Header */}
        <button
          onClick={handleFinishAndGenerateReport}
          className="px-5 py-3 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-heading font-extrabold text-xs sm:text-sm border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>리포트 생성하기</span>
        </button>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="flex-1 bg-white border-2 border-[#1E293B] rounded-3xl p-4 sm:p-6 shadow-pop-card flex flex-col overflow-hidden">
        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 min-h-[350px] max-h-[520px]">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-9 h-9 rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-center text-base font-bold shrink-0 mt-1 shadow-pop-sm">
                    ☁️
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-[#FFFDF5] border-2 border-[#1E293B] text-[#1E293B] font-medium rounded-3xl rounded-tl-sm shadow-pop-sm'
                      : 'bg-[#8B5CF6] text-white border-2 border-[#1E293B] font-bold rounded-3xl rounded-tr-sm shadow-pop-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <div
                    className={`text-[10px] font-mono mt-2 text-right ${
                      isBot ? 'text-slate-400' : 'text-violet-200'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-9 h-9 rounded-2xl bg-[#F472B6] border-2 border-[#1E293B] text-white flex items-center justify-center shrink-0 mt-1 shadow-pop-sm">
                    <User className="w-4 h-4 stroke-[2.5]" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-9 h-9 rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-center text-base font-bold shrink-0 mt-1 shadow-pop-sm">
                ☁️
              </div>
              <div className="bg-[#FFFDF5] border-2 border-[#1E293B] rounded-3xl rounded-tl-sm px-5 py-3.5 text-[#1E293B] font-bold text-xs shadow-pop-sm flex items-center gap-2">
                <span>포미가 다정한 답글을 적고 있어요</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#F472B6] animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-4 pt-3 border-t-2 border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5 font-bold">
            <Lightbulb className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
            <span>이런 이야기를 털어놓아 보세요:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(reply)}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-full bg-[#FFFDF5] hover:bg-[#FBBF24] text-[#1E293B] text-xs font-bold whitespace-nowrap border-2 border-[#1E293B] shadow-pop-sm transition-all shrink-0 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-3 flex items-center gap-2.5"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="포미에게 마음속 생각이나 고민을 편하게 적어주세요..."
            disabled={isLoading}
            className="flex-1 px-5 py-3.5 rounded-full border-2 border-slate-300 focus:border-[#8B5CF6] focus:shadow-pop-violet text-xs sm:text-sm bg-[#FFFDF5] text-[#1E293B] font-medium placeholder:text-slate-400 outline-none transition-all disabled:bg-slate-100"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3.5 rounded-full bg-[#F472B6] hover:bg-[#EC4899] text-white border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="메시지 전송"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>

      {/* Bottom Completion Banner & Navigation */}
      <div className="mt-5 p-5 sm:p-6 rounded-3xl bg-[#34D399]/20 border-2 border-[#1E293B] shadow-pop-card flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#34D399] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-center shrink-0 shadow-pop-sm">
            <Heart className="w-5 h-5 fill-[#1E293B]" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-sm text-[#1E293B]">
              대화 {userMessagesCount > 0 ? `${userMessagesCount}회 진행 중` : '시작 단계'}
            </div>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              {userMessagesCount > 0
                ? '나눈 대화 내용이 종합되어 당신만을 위한 맞춤형 심리 리포트에 상세히 반영됩니다.'
                : '대화를 나누지 않고 바로 리포트를 생성하셔도 괜찮습니다.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancelToForm}
            className="px-5 py-3 rounded-full border-2 border-[#1E293B] bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>진단 수정</span>
          </button>

          <button
            type="button"
            onClick={handleFinishAndGenerateReport}
            className="flex-1 sm:flex-none px-7 py-3.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-heading font-extrabold text-xs sm:text-sm border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>최종 리포트 생성하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { playMindfulChime } from '../utils/audio';
import confetti from 'canvas-confetti';

interface BreathingModalProps {
  onClose: () => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale';

export const BreathingModal: React.FC<BreathingModalProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 seconds
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 4-7-8 timing definitions
  const INHALE_DURATION = 4;
  const HOLD_DURATION = 7;
  const EXHALE_DURATION = 8;

  // Handle phase transitions
  useEffect(() => {
    if (!isActive || isCompleted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsCompleted(true);
          setIsActive(false);
          if (soundEnabled) playMindfulChime('complete');
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399'],
          });
          return 0;
        }
        return t - 1;
      });

      setPhaseSecondsLeft((curr) => {
        if (curr <= 1) {
          // Switch to next phase
          if (phase === 'inhale') {
            setPhase('hold');
            return HOLD_DURATION;
          } else if (phase === 'hold') {
            setPhase('exhale');
            if (soundEnabled) playMindfulChime('exhale');
            return EXHALE_DURATION;
          } else {
            setPhase('inhale');
            setCycleCount((c) => c + 1);
            if (soundEnabled) playMindfulChime('inhale');
            return INHALE_DURATION;
          }
        }
        return curr - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, isCompleted, soundEnabled]);

  // Initial chime
  useEffect(() => {
    if (soundEnabled && isActive) {
      playMindfulChime('inhale');
    }
  }, []);

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(180);
    setPhase('inhale');
    setPhaseSecondsLeft(INHALE_DURATION);
    setCycleCount(1);
    setIsCompleted(false);
  };

  const formatMinutes = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getPhaseGuide = () => {
    switch (phase) {
      case 'inhale':
        return {
          title: '코로 천천히 들이마시기',
          sub: '맑고 평온한 에너지를 가득 채웁니다',
          scale: 'scale-125',
          bg: 'bg-[#8B5CF6] text-white border-3 border-[#1E293B] shadow-pop',
        };
      case 'hold':
        return {
          title: '잠시 숨을 멈추고 머물기',
          sub: '내면의 고요한 순간에 집중합니다',
          scale: 'scale-120',
          bg: 'bg-[#FBBF24] text-[#1E293B] border-3 border-[#1E293B] shadow-pop',
        };
      case 'exhale':
        return {
          title: '입으로 부드럽게 내쉬기',
          sub: '어깨와 가슴의 긴장을 모두 비워냅니다',
          scale: 'scale-90',
          bg: 'bg-[#F472B6] text-white border-3 border-[#1E293B] shadow-pop',
        };
    }
  };

  const guide = getPhaseGuide();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDF5] rounded-3xl p-6 sm:p-9 max-w-lg w-full border-3 border-[#1E293B] shadow-pop-card relative overflow-hidden flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border-2 border-[#1E293B] bg-white text-[#1E293B] hover:bg-[#F472B6] hover:text-white shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] font-heading font-extrabold text-xs mb-2 shadow-pop-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4-7-8 박스 이완 호흡법</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
            3분 마음 안심 호흡
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            부교감 신경을 활성화하여 즉각적인 스트레스 완화를 돕습니다.
          </p>
        </div>

        {/* Completed State */}
        {isCompleted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-[#34D399] border-3 border-[#1E293B] text-[#1E293B] flex items-center justify-center mx-auto shadow-pop">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="font-heading text-2xl font-extrabold text-[#1E293B]">
              3분 호흡을 훌륭히 마쳤습니다!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
              몸과 마음에 조금 더 맑은 여유가 찾아왔기를 바랍니다. 지금의 차분한 감각을 기억하세요.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-full bg-[#8B5CF6] text-white font-heading font-extrabold text-xs sm:text-sm border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all mt-3 cursor-pointer"
            >
              리포트로 돌아가기
            </button>
          </div>
        ) : (
          <>
            {/* Visual Animated Breathing Circle */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-4 flex items-center justify-center">
              {/* Outer Ripple */}
              <div
                className={`absolute inset-0 rounded-full border-2 border-[#1E293B]/20 bg-[#8B5CF6]/10 transition-transform duration-1000 ease-in-out ${
                  isActive ? guide.scale : 'scale-100'
                }`}
              />
              <div
                className={`absolute inset-4 rounded-full border-2 border-[#1E293B]/30 bg-[#F472B6]/15 transition-transform duration-700 ease-in-out ${
                  isActive ? guide.scale : 'scale-100'
                }`}
              />

              {/* Main Breathing Core */}
              <div
                className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center p-4 text-center transition-all duration-1000 z-10 ${guide.bg}`}
              >
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                  {phaseSecondsLeft}초
                </span>
                <span className="text-xs font-heading font-extrabold mt-1 uppercase tracking-wider">
                  {phase === 'inhale' && '들이마시기'}
                  {phase === 'hold' && '멈춤'}
                  {phase === 'exhale' && '내쉬기'}
                </span>
              </div>
            </div>

            {/* Instruction Text */}
            <div className="text-center my-3 min-h-[48px]">
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1E293B]">
                {guide.title}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {guide.sub}
              </p>
            </div>

            {/* Timers & Cycles Info */}
            <div className="flex items-center justify-center gap-6 my-2 text-xs text-[#1E293B] font-bold bg-white px-5 py-2.5 rounded-full border-2 border-[#1E293B] shadow-pop-sm">
              <div>
                남은 시간:{' '}
                <span className="font-mono font-black text-[#1E293B]">
                  {formatMinutes(timeLeft)}
                </span>
              </div>
              <span className="text-slate-300">•</span>
              <div>
                호흡 주기:{' '}
                <span className="font-mono font-black text-[#8B5CF6]">
                  {cycleCount}회차
                </span>
              </div>
            </div>

            {/* Control Bar */}
            <div className="flex items-center justify-center gap-3.5 mt-5">
              <button
                onClick={() => setSoundEnabled((v) => !v)}
                className={`p-3.5 rounded-full border-2 border-[#1E293B] transition-all shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer ${
                  soundEnabled
                    ? 'bg-[#34D399] text-[#1E293B]'
                    : 'bg-white text-slate-400'
                }`}
                title={soundEnabled ? '사운드 켜짐' : '사운드 음소거'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 stroke-[2.5]" /> : <VolumeX className="w-4 h-4 stroke-[2.5]" />}
              </button>

              <button
                onClick={() => setIsActive((v) => !v)}
                className="px-7 py-3.5 rounded-full bg-[#1E293B] hover:bg-slate-800 text-white font-heading font-extrabold text-xs sm:text-sm border-2 border-[#1E293B] shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 stroke-[2.5]" />
                    <span>일시 정지</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 stroke-[2.5]" />
                    <span>다시 시작</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-3.5 rounded-full border-2 border-[#1E293B] bg-white hover:bg-slate-100 text-[#1E293B] shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
                title="처음부터 다시하기"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


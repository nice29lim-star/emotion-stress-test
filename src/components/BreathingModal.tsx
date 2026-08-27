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
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
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
          bg: 'bg-teal-100/90 text-teal-900 border-teal-300',
        };
      case 'hold':
        return {
          title: '잠시 숨을 멈추고 머물기',
          sub: '내면의 고요한 순간에 집중합니다',
          scale: 'scale-120',
          bg: 'bg-amber-100/90 text-amber-900 border-amber-300',
        };
      case 'exhale':
        return {
          title: '입으로 부드럽게 내쉬기',
          sub: '어깨와 가슴의 긴장을 모두 비워냅니다',
          scale: 'scale-90',
          bg: 'bg-rose-100/90 text-rose-900 border-rose-300',
        };
    }
  };

  const guide = getPhaseGuide();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200/80 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4-7-8 박스 이완 호흡법</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            3분 마음 안심 호흡
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            부교감 신경을 활성화하여 즉각적인 스트레스 완화를 돕습니다.
          </p>
        </div>

        {/* Completed State */}
        {isCompleted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              3분 호흡을 훌륭히 마쳤습니다!
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xs mx-auto leading-relaxed">
              몸과 마음에 조금 더 맑은 여유가 찾아왔기를 바랍니다. 지금의 차분한 감각을 기억하세요.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-teal-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-teal-700/20 hover:bg-teal-800 transition-colors mt-2"
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
                className={`absolute inset-0 rounded-full bg-teal-200/30 transition-transform duration-1000 ease-in-out ${
                  isActive ? guide.scale : 'scale-100'
                }`}
              />
              <div
                className={`absolute inset-4 rounded-full bg-teal-300/20 transition-transform duration-700 ease-in-out ${
                  isActive ? guide.scale : 'scale-100'
                }`}
              />

              {/* Main Breathing Core */}
              <div
                className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 shadow-lg flex flex-col items-center justify-center p-4 text-center transition-all duration-1000 ${guide.bg}`}
              >
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
                  {phaseSecondsLeft}초
                </span>
                <span className="text-xs font-bold mt-1 uppercase tracking-wider">
                  {phase === 'inhale' && '들이마시기'}
                  {phase === 'hold' && '멈춤'}
                  {phase === 'exhale' && '내쉬기'}
                </span>
              </div>
            </div>

            {/* Instruction Text */}
            <div className="text-center my-3 min-h-[48px]">
              <h3 className="text-base font-bold text-stone-900">
                {guide.title}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {guide.sub}
              </p>
            </div>

            {/* Timers & Cycles Info */}
            <div className="flex items-center justify-center gap-6 my-2 text-xs text-stone-600 font-medium bg-stone-100/80 px-4 py-2 rounded-2xl">
              <div>
                남은 시간:{' '}
                <span className="font-mono font-bold text-stone-900">
                  {formatMinutes(timeLeft)}
                </span>
              </div>
              <span className="text-stone-300">•</span>
              <div>
                호흡 주기:{' '}
                <span className="font-mono font-bold text-teal-700">
                  {cycleCount}회차
                </span>
              </div>
            </div>

            {/* Control Bar */}
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={() => setSoundEnabled((v) => !v)}
                className={`p-3 rounded-2xl border transition-colors ${
                  soundEnabled
                    ? 'bg-teal-50 border-teal-200 text-teal-800'
                    : 'bg-white border-stone-200 text-stone-400'
                }`}
                title={soundEnabled ? '사운드 켜짐' : '사운드 음소거'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsActive((v) => !v)}
                className="px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2"
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>일시 정지</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>다시 시작</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 transition-colors"
                title="처음부터 다시하기"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

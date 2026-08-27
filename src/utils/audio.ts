// Web Audio synthesizer for ambient gentle mindfulness bell
let audioCtx: AudioContext | null = null;

export function playMindfulChime(type: 'inhale' | 'exhale' | 'complete' = 'inhale') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';

    if (type === 'inhale') {
      // Warm rising tone: F4 (349.23Hz) to A4 (440Hz)
      osc.frequency.setValueAtTime(349.23, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 1.5);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 3.0);
    } else if (type === 'exhale') {
      // Calming falling tone: C5 (523.25Hz) to G4 (392Hz)
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(329.63, now + 2.0);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 3.5);
    } else {
      // Completion chime chord (Crystal bell)
      const freqs = [528, 660, 792];
      freqs.forEach((freq, idx) => {
        const o = audioCtx!.createOscillator();
        const g = audioCtx!.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + idx * 0.15);
        g.gain.setValueAtTime(0.001, now + idx * 0.15);
        g.gain.linearRampToValueAtTime(0.06, now + idx * 0.15 + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 3.5);
        o.connect(g);
        g.connect(audioCtx!.destination);
        o.start(now + idx * 0.15);
        o.stop(now + idx * 0.15 + 3.5);
      });
    }
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

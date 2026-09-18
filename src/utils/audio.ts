// Web Audio API synth for gentle, pleasant auditory feedback

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a gentle, soft pedagogical success chime
 */
export function playSuccessChime(soundEnabled: boolean = true) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Create two gentle harmonic sine tones
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.08); // G5
    osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.22); // C6

    // Soft, soothing envelope
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.09, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.08);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.55);
  } catch {
    // Silently ignore if audio context is blocked by browser policy
  }
}

/**
  * Play pleasant UI feedback tone (click, save, delete, switch)
  */
export function playTone(type: 'click' | 'save' | 'delete' | 'success' | 'tab' | string = 'click', soundEnabled: boolean = true) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'success') {
      playSuccessChime(soundEnabled);
      return;
    }

    if (type === 'delete') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
      return;
    }

    // Default gentle click / tab tone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(type === 'tab' ? 440 : 587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Silently ignore
  }
}

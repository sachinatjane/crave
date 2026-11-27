let audioCtx: AudioContext | null = null;

export function playTimerChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;
    if (!audioCtx) {
      audioCtx = new AudioContextCtor();
    }
    if (audioCtx.state === 'suspended') {
      void audioCtx.resume();
    }

    const notes = [880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.14);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + idx * 0.14 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + idx * 0.14 + 0.7);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.14);
      osc.stop(audioCtx.currentTime + idx * 0.14 + 0.75);
    });
  } catch {
    // Audio playback blocked in restricted WebView
  }
}

export function triggerHaptic(pattern: number | number[] = 30): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Haptics unsupported
    }
  }
}

export function speakStepAloud(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.pitch = 1.02;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

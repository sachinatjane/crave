import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Recipe, UnitSystem } from '../types/recipe';
import { formatScaledIngredient, renderStepInstruction } from '../utils/scaler';
import {
  playTimerChime,
  speakStepAloud,
  stopSpeech,
  triggerHaptic
} from '../utils/audioHaptics';
import { SafeImage } from './SafeImage';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface CookModeViewProps {
  recipe: Recipe;
  servings: number;
  unit: UnitSystem;
  initialStepIndex?: number;
  checkedItems: Record<string, boolean>;
  onToggleIngredient: (ingredientId: string) => void;
  onFinishCook: () => void;
  onToast: (msg: string, icon?: string) => void;
}

export const CookModeView: React.FC<CookModeViewProps> = ({
  recipe,
  servings,
  unit,
  initialStepIndex = 0,
  checkedItems,
  onToggleIngredient,
  onFinishCook,
  onToast
}) => {
  const [stepIdx, setStepIdx] = useState(
    Math.min(Math.max(initialStepIndex, 0), recipe.steps.length - 1)
  );
  const activeStep = recipe.steps[stepIdx];
  const defaultSeconds = activeStep.timerSeconds || activeStep.durationMin * 60;

  const [secondsLeft, setSecondsLeft] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [vibeOn, setVibeOn] = useState(true);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [peekOpen, setPeekOpen] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // Wake Lock API (with honest status indicator & safe WebView fallback)
  useEffect(() => {
    let sentinel: { release: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> };
    };

    const requestLock = async () => {
      if (nav.wakeLock) {
        try {
          sentinel = await nav.wakeLock.request('screen');
          setWakeLockActive(true);
        } catch {
          setWakeLockActive(false);
        }
      }
    };
    void requestLock();

    const onVisChange = () => {
      if (document.visibilityState === 'visible') {
        void requestLock();
      }
    };
    document.addEventListener('visibilitychange', onVisChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisChange);
      if (sentinel) {
        void sentinel.release().catch(() => undefined);
      }
      stopSpeech();
    };
  }, []);

  // Reset step timer when switching steps
  useEffect(() => {
    const nextDefault =
      recipe.steps[stepIdx].timerSeconds || recipe.steps[stepIdx].durationMin * 60;
    setSecondsLeft(nextDefault);
    setIsRunning(false);
    stopSpeech();
    setIsSpeaking(false);
  }, [stepIdx, recipe.steps]);

  // Countdown tick
  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setIsRunning(false);
          if (soundOn) playTimerChime();
          if (vibeOn) triggerHaptic([120, 60, 120, 60, 180]);
          onToast(`Timer done for Step ${stepIdx + 1}! 🔔`, 'notifications_active');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning, soundOn, vibeOn, stepIdx, onToast]);

  const goNext = useCallback(() => {
    if (vibeOn) triggerHaptic([35, 25, 35]);
    if (stepIdx < recipe.steps.length - 1) {
      setStepIdx((s) => s + 1);
    } else {
      onFinishCook();
    }
  }, [stepIdx, recipe.steps.length, vibeOn, onFinishCook]);

  const goPrev = useCallback(() => {
    if (vibeOn) triggerHaptic(25);
    setStepIdx((s) => Math.max(0, s - 1));
  }, [vibeOn]);

  // Web Speech API detection + Hands-Free Voice Control
  useEffect(() => {
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = win.SpeechRecognition || win.webkitSpeechRecognition;
    setVoiceSupported(Boolean(Ctor));

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleVoiceControl = () => {
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Ctor) {
      onToast('Voice commands work in Chrome/Android — use Read Aloud or swipe!', 'mic_off');
      return;
    }

    if (voiceListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setVoiceListening(false);
      return;
    }

    try {
      const rec = new Ctor();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (event) => {
        const last = event.results[event.results.length - 1];
        const transcript = last?.[0]?.transcript?.toLowerCase() || '';
        if (transcript.includes('next')) goNext();
        else if (transcript.includes('back') || transcript.includes('previous')) goPrev();
        else if (transcript.includes('pause') || transcript.includes('stop')) setIsRunning(false);
        else if (transcript.includes('start') || transcript.includes('resume')) setIsRunning(true);
        else if (transcript.includes('list') || transcript.includes('ingredient')) setPeekOpen(true);
      };
      rec.onerror = () => setVoiceListening(false);
      rec.onend = () => setVoiceListening(false);
      rec.start();
      recognitionRef.current = rec;
      setVoiceListening(true);
      onToast('Listening! Say "Next", "Back", "Start", or "Pause"', 'mic');
    } catch {
      setVoiceListening(false);
    }
  };

  const renderedInstruction = renderStepInstruction(
    activeStep.instructionTemplate,
    recipe,
    servings,
    unit
  );

  const handleReadAloud = () => {
    triggerHaptic(20);
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    const ok = speakStepAloud(
      `Step ${activeStep.stepNumber}. ${activeStep.title}. ${renderedInstruction}`
    );
    if (ok) {
      setIsSpeaking(true);
    } else {
      onToast('Speech synthesis unavailable in this in-app browser', 'volume_off');
    }
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const progressPct = Math.round(((stepIdx + 1) / recipe.steps.length) * 100);
  const allIngredients = recipe.ingredientGroups.flatMap((g) => g.items);

  return (
    <div
      className="flex flex-col w-full max-w-2xl mx-auto pb-32 select-none"
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (delta < -65) goNext();
        else if (delta > 65) goPrev();
        touchStartX.current = null;
      }}
    >
      {/* Top Accessibility & Progress Zone */}
      <section className="px-gutter pt-space-xs pb-space-sm bg-surface flex flex-col gap-space-xs">
        <div className="flex items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs min-w-0">
            <span className="bg-primary/10 text-primary font-label-md text-label-md px-2.5 py-1 rounded-full whitespace-nowrap font-extrabold">
              STEP {stepIdx + 1} OF {recipe.steps.length}
            </span>
            <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm">
              <span
                className={`material-symbols-outlined text-[14px] ${
                  wakeLockActive ? 'text-pistachio-dark' : 'text-tertiary'
                }`}
              >
                lightbulb
              </span>
              <span className="truncate">
                {wakeLockActive ? 'Awake Active' : 'Keep Screen On'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPeekOpen(true)}
            className="h-10 px-space-sm bg-surface-container-highest hover:bg-surface-container text-on-surface font-label-lg text-label-lg rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">
              local_dining
            </span>
            <span>Peek List</span>
          </button>
        </div>

        {/* Milestone Bar */}
        <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden flex items-center">
          <div
            className="h-full bg-gradient-to-r from-primary via-primary-container to-tertiary-fixed-dim rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm">
          <span className="text-primary font-bold">Phase: {activeStep.phaseLabel}</span>
          <span>{progressPct}% Complete</span>
        </div>
      </section>

      {/* Giant Active Step Typography */}
      <section className="px-gutter py-space-xs flex flex-col gap-space-sm">
        <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-[0_4px_20px_-2px_rgba(30,19,14,0.06)] flex flex-col gap-space-sm">
          {/* Voice & Read-Aloud HUD */}
          <div className="flex items-center justify-between gap-2 bg-surface-container px-3 py-1.5 rounded-full">
            <button
              type="button"
              onClick={toggleVoiceControl}
              className="flex items-center gap-2 text-left"
            >
              <span className="relative flex h-2.5 w-2.5">
                {voiceListening && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    voiceListening ? 'bg-primary' : 'bg-secondary/50'
                  }`}
                />
              </span>
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
                {voiceListening
                  ? 'Listening'
                  : voiceSupported
                  ? 'Tap for Voice'
                  : 'Swipe or Tap'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleReadAloud}
              className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 transition-colors ${
                isSpeaking
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isSpeaking ? 'stop_circle' : 'record_voice_over'}
              </span>
              <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
            </button>
          </div>

          {/* Step Heading & Scaled Instruction */}
          <div className="flex flex-col gap-space-2xs">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-tight">
              {activeStep.title}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {renderedInstruction}
            </p>
          </div>

          {/* Active Batch Visual Strip */}
          <div className="flex items-center gap-space-sm bg-surface-container-low p-2.5 rounded-DEFAULT">
            <SafeImage
              src={activeStep.image || recipe.thumbImage}
              alt={activeStep.title}
              className="w-16 h-16 rounded-DEFAULT object-cover shrink-0"
              eager
            />
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-primary uppercase">
                Scaled for {servings} Servings
              </span>
              <span className="font-title-md text-title-md text-on-surface truncate">
                {activeStep.activeMeasureSummary || recipe.title}
              </span>
              <span className="font-body-sm text-body-sm text-secondary truncate">
                Swipe left/right anywhere to switch steps
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Integrated Smart Kitchen Timer */}
      <section className="px-gutter py-space-xs flex flex-col gap-space-xs">
        <div className="bg-inverse-surface text-inverse-on-surface rounded-lg p-space-md shadow-xl flex flex-col items-center justify-center gap-space-sm">
          <div className="w-full flex items-center justify-between text-surface-variant/80 font-label-md text-label-md">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
                timer
              </span>
              <span>STEP {stepIdx + 1} KITCHEN CLOCK</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                aria-label="Toggle sound chime"
                onClick={() => setSoundOn((s) => !s)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  soundOn ? 'bg-surface-variant/25 text-white' : 'bg-white/5 text-white/40'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {soundOn ? 'volume_up' : 'volume_off'}
                </span>
              </button>
              <button
                type="button"
                aria-label="Toggle vibration"
                onClick={() => setVibeOn((v) => !v)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  vibeOn ? 'bg-surface-variant/25 text-white' : 'bg-white/5 text-white/40'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">vibration</span>
              </button>
            </div>
          </div>

          <div className="flex items-baseline justify-center font-display-lg text-display-lg font-black tracking-tight text-surface-container-lowest my-space-2xs tabular-nums">
            <span>{mins}</span>
            <span className={`mx-1 text-primary-fixed-dim ${isRunning ? 'animate-pulse' : ''}`}>
              :
            </span>
            <span>{secs}</span>
          </div>

          <div className="grid grid-cols-3 gap-space-xs w-full">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(25);
                setIsRunning((r) => !r);
              }}
              className={`h-14 font-title-md text-title-md rounded-DEFAULT flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all ${
                isRunning
                  ? 'bg-tertiary text-on-tertiary'
                  : 'bg-primary text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {isRunning ? 'pause' : 'play_arrow'}
              </span>
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setSecondsLeft((s) => s + 60);
              }}
              className="h-14 bg-surface-variant/25 hover:bg-surface-variant/35 text-surface-container-lowest font-title-md text-title-md rounded-DEFAULT flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">more_time</span>
              <span>+1 Min</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setIsRunning(false);
                setSecondsLeft(defaultSeconds);
              }}
              className="h-14 bg-surface-variant/15 hover:bg-surface-variant/25 text-surface-variant font-title-md text-title-md rounded-DEFAULT flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      {/* Step Mini-Timeline Pills */}
      <section className="px-gutter pt-space-sm pb-space-xs">
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-1">
          {recipe.steps.map((s, idx) => {
            const done = idx < stepIdx;
            const current = idx === stepIdx;
            return (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => setStepIdx(idx)}
                className={`flex items-center gap-2 px-space-sm py-2 rounded-full shrink-0 transition-all ${
                  current
                    ? 'bg-primary-container text-on-primary-container shadow-sm font-bold'
                    : done
                    ? 'bg-surface-container-low text-on-surface opacity-65'
                    : 'bg-surface-container-low text-on-surface opacity-85'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {done ? 'check_circle' : current ? 'restaurant' : 'pending'}
                </span>
                <span className="font-label-md text-label-md">
                  {s.stepNumber}. {s.phaseLabel}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Palm & Knuckle Hands-Free Giant Bottom Nav Deck */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-xl pb-safe pt-space-xs px-gutter shadow-[0_-8px_30px_rgba(39,24,17,0.12)]">
        <div className="flex items-center gap-space-xs max-w-md mx-auto py-space-xs">
          <button
            type="button"
            disabled={stepIdx === 0}
            onClick={goPrev}
            className="h-16 w-1/3 bg-surface-container-highest hover:bg-surface-container text-on-surface rounded-DEFAULT flex flex-col items-center justify-center active:scale-95 transition-transform disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Back
            </span>
          </button>

          <button
            type="button"
            onClick={goNext}
            className="h-16 w-2/3 bg-primary-container hover:bg-primary text-on-primary-container font-title-md text-title-md rounded-DEFAULT flex items-center justify-between px-space-md shadow-lg shadow-primary-container/30 active:scale-95 transition-all"
          >
            <div className="flex flex-col text-left min-w-0">
              <span className="font-label-sm text-label-sm text-on-primary/80 uppercase">
                {stepIdx < recipe.steps.length - 1
                  ? `Next Step (${stepIdx + 2}/${recipe.steps.length})`
                  : 'Final Step Done'}
              </span>
              <span className="font-title-md text-title-md font-bold leading-tight truncate">
                {stepIdx < recipe.steps.length - 1
                  ? recipe.steps[stepIdx + 1].title
                  : 'Finish & Share Bake 🎉'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-on-primary-container/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">
                {stepIdx < recipe.steps.length - 1 ? 'arrow_forward' : 'celebration'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Quick-Peek Scaled Ingredients Drawer */}
      {peekOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Scaled Recipe Ingredients"
          className="fixed inset-0 z-50 bg-inverse-surface/65 backdrop-blur-sm flex flex-col justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPeekOpen(false);
          }}
        >
          <div className="w-full max-w-xl mx-auto bg-surface rounded-t-xl p-gutter pb-safe flex flex-col gap-space-md max-h-[82dvh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase">
                  Scaled for {servings} Servings
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  All Recipe Measurements
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close Ingredients Drawer"
                onClick={() => setPeekOpen(false)}
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-xs">
              {allIngredients.map((item) => {
                const isForCurrentStep = item.stepRef === activeStep.stepNumber;
                const checked = Boolean(checkedItems[item.id]);
                const qty = formatScaledIngredient(item, servings, recipe.baseServings, unit);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggleIngredient(item.id)}
                    className={`p-3 rounded-DEFAULT flex items-center justify-between text-left ${
                      isForCurrentStep ? 'bg-primary/10' : 'bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          checked
                            ? 'text-pistachio-dark'
                            : isForCurrentStep
                            ? 'text-primary'
                            : 'text-secondary'
                        }`}
                      >
                        {checked ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span
                        className={`font-title-md text-title-md text-on-surface truncate ${
                          checked ? 'line-through opacity-50' : ''
                        }`}
                      >
                        {qty} {item.name}
                      </span>
                    </div>
                    <span
                      className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                        isForCurrentStep
                          ? 'bg-surface text-primary font-bold'
                          : 'text-secondary'
                      }`}
                    >
                      {isForCurrentStep ? `Step ${item.stepRef} (Now)` : `Step ${item.stepRef || 1}`}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setPeekOpen(false)}
              className="w-full h-14 bg-primary text-on-primary font-title-md text-title-md rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span>Back to Hands-Free Cook Mode</span>
              <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

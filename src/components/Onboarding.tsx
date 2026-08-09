/**
 * Phase 3.10 — First-Run Onboarding
 * 
 * 2–3 screen overlay shown once on first app launch.
 * Skippable with a single tap. Tracked via localStorage.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { transitions } from '../hooks/useMotion';

const ONBOARDING_KEY = 'anilog_onboarding_seen';

interface OnboardingScreen {
  icon: string;
  title: string;
  description: string;
}

const screens: OnboardingScreen[] = [
  {
    icon: 'movie',
    title: 'Track Your Anime',
    description: 'Keep a personal log of everything you watch — your progress, ratings, and notes, all in one place.',
  },
  {
    icon: 'search',
    title: 'Discover New Shows',
    description: 'Search AniList\'s entire catalog. See what\'s trending, find your next binge, and add it instantly.',
  },
  {
    icon: 'download_done',
    title: 'Works Offline',
    description: 'Your collection lives on your device. No account needed, no internet required to track progress.',
  },
];

export default function Onboarding() {
  const [visible, setVisible] = useState(() => {
    return !localStorage.getItem(ONBOARDING_KEY);
  });
  const [step, setStep] = useState(0);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setVisible(false);
  };

  const next = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  const current = screens[step];

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transitions.default}
    >
      {/* Skip button */}
      <button
        onClick={dismiss}
        className="absolute top-6 right-6 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
      >
        Skip
      </button>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="flex flex-col items-center text-center max-w-sm"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={transitions.default}
        >
          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-5xl text-primary filled">{current.icon}</span>
          </div>

          {/* Title */}
          <h2 className="font-headline-lg text-headline-lg text-primary mb-4">{current.title}</h2>

          {/* Description */}
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{current.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Dots + Action */}
      <div className="absolute bottom-16 flex flex-col items-center gap-8">
        {/* Dots */}
        <div className="flex gap-2">
          {screens.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-primary' : 'w-2 bg-outline-variant'
              }`}
            />
          ))}
        </div>

        {/* Continue button */}
        <button
          onClick={next}
          className="bg-primary text-on-primary font-label-md text-label-md py-4 px-12 rounded-full hover:opacity-90 transition-opacity active:scale-95"
        >
          {step < screens.length - 1 ? 'Continue' : 'Get Started'}
        </button>
      </div>
    </motion.div>
  );
}

/**
 * RateSheet — Feature #14
 * A bottom-sheet that appears immediately after the user marks an anime as "completed",
 * prompting them to rate it while the experience is fresh.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface RateSheetProps {
  isOpen: boolean;
  animeTitle: string;
  currentScore: number;
  onRate: (score: number) => void;
  onDismiss: () => void;
}

export default function RateSheet({ isOpen, animeTitle, currentScore, onRate, onDismiss }: RateSheetProps) {
  const [hovered, setHovered] = useState(0);
  const displayed = hovered || currentScore;

  const labels = ['', 'Disappointing', 'Below Average', 'Good', 'Really Good', 'Masterpiece'];

  const handleRate = (score: number) => {
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    onRate(score);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="rate-backdrop"
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          />

          {/* Sheet */}
          <motion.div
            key="rate-sheet"
            className="fixed bottom-0 left-0 right-0 z-[151] bg-surface-container-lowest rounded-t-3xl p-8 pb-12 flex flex-col items-center gap-6 shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-outline-variant mx-auto absolute top-3" />

            <div className="text-center mt-2">
              <span className="material-symbols-outlined filled text-5xl text-secondary mb-3 block">workspace_premium</span>
              <h2 className="font-headline-md text-primary">You finished it!</h2>
              <p className="font-body-md text-on-surface-variant mt-1 line-clamp-1 max-w-xs">{animeTitle}</p>
            </div>

            <p className="font-label-md text-on-surface-variant uppercase tracking-wider text-xs">How would you rate it?</p>

            {/* Stars */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className="w-14 h-14 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:scale-90"
                  aria-label={`Rate ${star} out of 5`}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onTouchStart={() => setHovered(star)}
                  onClick={() => handleRate(star)}
                >
                  <span
                    className={`material-symbols-outlined text-[36px] transition-all duration-150 ${
                      displayed >= star ? 'filled text-secondary scale-110' : 'text-surface-variant'
                    }`}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>

            {/* Label */}
            <motion.p
              key={displayed}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-headline-sm text-secondary h-6"
            >
              {displayed > 0 ? labels[displayed] : ''}
            </motion.p>

            <button
              onClick={onDismiss}
              className="text-on-surface-variant font-label-md text-sm underline underline-offset-2 hover:text-primary transition-colors"
            >
              Skip for now
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

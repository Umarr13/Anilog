/**
 * Phase 3.2 — Optimistic UI: Checkmark animation
 * 
 * A small animated checkmark that pops in and fades out 
 * when an episode is incremented or a score is saved.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { transitions } from '../hooks/useMotion';

interface SaveIndicatorProps {
  visible: boolean;
}

export default function SaveIndicator({ visible }: SaveIndicatorProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="inline-flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={transitions.micro}
        >
          <span className="material-symbols-outlined text-secondary filled text-[20px]">check_circle</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

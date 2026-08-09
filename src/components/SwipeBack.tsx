/**
 * Phase 3.1 — Swipe-back gesture wrapper
 * 
 * Wraps page content and enables swipe-right-to-go-back via framer-motion drag.
 * Only active on mobile (< md breakpoint) and only on pages with a back destination.
 */
import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type PanInfo } from 'framer-motion';
import { transitions } from '../hooks/useMotion';

interface SwipeBackProps {
  children: ReactNode;
  /** Disable the gesture (e.g. on the Dashboard which has no "back") */
  disabled?: boolean;
}

export default function SwipeBack({ children, disabled }: SwipeBackProps) {
  const navigate = useNavigate();

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Only trigger if horizontal swipe was fast enough or far enough
    if (info.offset.x > 100 || info.velocity.x > 500) {
      navigate(-1);
    }
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <motion.div
      drag="x"
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      transition={transitions.spring}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

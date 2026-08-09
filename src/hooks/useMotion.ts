/**
 * Phase 3.9 — Consistent Motion Language
 * 
 * Central easing curve and duration system for all animations.
 * All framer-motion transitions across the app should reference these constants.
 */

export const MOTION = {
  /** The standard easing for most UI transitions (Material Design emphasis curve) */
  easing: [0.16, 1, 0.3, 1] as const,
  /** A snappier easing for micro-interactions like button presses */
  easingSnap: [0.22, 0.68, 0, 1.2] as const,
  /** Soft spring config for drag / gesture releases */
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },

  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.35,
    slow: 0.5,
    page: 0.45,
  },
} as const;

/** Reusable framer-motion transition presets */
export const transitions = {
  /** Default transition for most element state changes */
  default: {
    duration: MOTION.duration.normal,
    ease: MOTION.easing,
  },
  /** Page enter/exit transition */
  page: {
    duration: MOTION.duration.page,
    ease: MOTION.easing,
  },
  /** Snappy micro-interactions (star taps, toggles, checkmarks) */
  micro: {
    duration: MOTION.duration.fast,
    ease: MOTION.easingSnap,
  },
  /** Spring for draggable elements */
  spring: MOTION.spring,
} as const;

/** Reusable framer-motion variant sets */
export const variants = {
  /** Fade-and-slide up — good for list items, cards */
  fadeSlideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  /** Fade in/out — for overlays, toasts */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  /** Scale pop — for checkmarks, action confirmations */
  scalePop: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  /** Stagger children container */
  staggerContainer: {
    animate: {
      transition: { staggerChildren: 0.06 },
    },
  },
  /** Individual staggered child */
  staggerChild: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
  },
  /** Slide from right (page transition) */
  slideRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
} as const;

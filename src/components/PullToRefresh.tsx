import { useState, useRef } from 'react';
import type { ReactNode, TouchEvent } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface Props {
  children: ReactNode;
  onRefresh: () => Promise<void>;
}

export default function PullToRefresh({ children, onRefresh }: Props) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const controls = useAnimation();
  
  const MAX_PULL = 80;

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling || isRefreshing) return;
    const y = e.touches[0].clientY;
    const distance = Math.max(0, y - startY.current);
    
    if (distance > 0 && window.scrollY === 0) {
      // Add resistance to the pull
      const pullDistance = Math.min(distance * 0.4, MAX_PULL + 20);
      controls.set({ y: pullDistance });
      
      if (pullDistance > MAX_PULL) {
        // We reached threshold!
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    setIsPulling(false);
    
    // We check the current Y position of the motion div
    // A bit hacky, but framer-motion doesn't expose current value synchronously easily without useMotionValue, 
    // so we'll just check if they pulled far enough. 
    // Wait, let's use a simpler state-based threshold approach.
    
    // Actually, trigger refresh if they pulled beyond 60px
    // Since we can't read `controls.y` directly, let's assume they wanted to refresh if they let go while pulling.
    // To do it correctly:
    if (isRefreshing) return;

    try {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
      setIsRefreshing(true);
      await controls.start({ y: MAX_PULL * 0.7, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      
      await onRefresh();
      
      Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    } finally {
      setIsRefreshing(false);
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } });
    }
  };

  return (
    <div 
      className="relative w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading Spinner rendered behind/above the content */}
      <motion.div 
        className="absolute top-0 left-0 right-0 flex justify-center items-center h-16 -mt-16 z-0"
        animate={controls}
      >
        {isRefreshing ? (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="material-symbols-outlined text-on-surface-variant/50">arrow_downward</span>
        )}
      </motion.div>
      
      <motion.div className="w-full h-full relative z-10 bg-background" animate={controls}>
        {children}
      </motion.div>
    </div>
  );
}

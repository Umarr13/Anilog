/**
 * Phase 3.8 — Long-Press Quick Actions (Context Menu)
 * 
 * Long-press a collection card to open a floating context menu
 * with quick actions: Mark next episode, Change status, Remove.
 */
import { useState, useRef, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { transitions, variants } from '../hooks/useMotion';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface ContextMenuItem {
  icon: string;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

interface ContextMenuProps {
  children: ReactNode;
  items: ContextMenuItem[];
  disabled?: boolean;
  previewImage?: string;
  previewTitle?: string;
  previewSubtitle?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function ContextMenu({ children, items, disabled, previewImage, previewTitle, previewSubtitle }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const LONG_PRESS_MS = 500;

  const handlePointerDown = useCallback(
    () => {
      if (disabled) return;
      longPressTimer.current = setTimeout(() => {
        setOpen(true);
      }, LONG_PRESS_MS);
    },
    [disabled],
  );

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop with extreme blur for 'Peek' effect */}
            <motion.div
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitions.micro}
              onClick={close}
            />

            {/* 7.2.4 Card Preview "Peek" */}
            {(previewImage || previewTitle) && (
              <motion.div
                className="fixed z-[92] top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] w-[240px] flex flex-col items-center pointer-events-none"
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 10 }}
                transition={transitions.spring}
              >
                {previewImage && (
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl border-2 border-surface-variant/30"
                  />
                )}
                {previewTitle && (
                  <div className="mt-4 text-center">
                    <h3 className="font-headline-md text-white text-xl drop-shadow-md">{previewTitle}</h3>
                    {previewSubtitle && <p className="text-white/80 font-label-md mt-1 drop-shadow-md">{previewSubtitle}</p>}
                  </div>
                )}
              </motion.div>
            )}

            {/* 4.25 Bottom Sheet for Quick Actions */}
            <motion.div
              className="fixed z-[95] bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-outline-variant/20 pt-2 pb-safe-area-bottom overflow-hidden"
              variants={variants.fadeSlideUp}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transitions.default}
            >
              {/* Drag handle */}
              <div className="w-full flex justify-center py-3">
                <div className="w-12 h-1.5 bg-surface-variant rounded-full"></div>
              </div>
              <div className="px-4 pb-4">
                <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-2 ml-2">Quick Actions</h3>
                {items.map((item) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl mb-1 text-left hover:bg-surface-container-low transition-colors ${
                      item.destructive
                        ? 'text-error hover:bg-error/10'
                        : 'text-on-surface'
                    }`}
                    onClick={() => {
                      item.onClick();
                      close();
                    }}
                  >
                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    <span className="font-body-lg text-body-lg">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

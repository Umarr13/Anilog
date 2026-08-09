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
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function ContextMenu({ children, items, disabled }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const LONG_PRESS_MS = 500;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      const clientX = e.clientX;
      const clientY = e.clientY;
      longPressTimer.current = setTimeout(() => {
        // Position the menu near the long-press point
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setPosition({
            x: clientX - rect.left,
            y: clientY - rect.top,
          });
        }
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
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[90]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitions.micro}
              onClick={close}
            />

            {/* Menu */}
            <motion.div
              className="absolute z-[95] min-w-[200px] bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/20 py-2 overflow-hidden"
              style={{
                left: Math.min(position.x, 200),
                top: position.y,
              }}
              variants={variants.scalePop}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transitions.micro}
            >
              {items.map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-container-low transition-colors ${
                    item.destructive
                      ? 'text-error'
                      : 'text-on-surface'
                  }`}
                  onClick={() => {
                    item.onClick();
                    close();
                  }}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="font-label-md text-label-md">{item.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

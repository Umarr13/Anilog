/**
 * Phase 3.3 — Undo Toast
 * 
 * A dismissible toast with an optional Undo action.
 * Managed via a global context so any component can trigger it.
 */
import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { transitions, variants } from '../hooks/useMotion';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ToastData {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, options?: { action?: ToastData['action']; duration?: number }) => void;
}

// ── Context ────────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback(
    (message: string, options?: { action?: ToastData['action']; duration?: number }) => {
      const id = nextId.current++;
      const duration = options?.duration ?? 5000;

      setToasts((prev) => [...prev, { id, message, action: options?.action, duration }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [],
  );

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext value={{ showToast }}>
      {children}

      {/* Toast container — fixed bottom-center, above nav */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-md pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              variants={variants.fadeSlideUp}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transitions.default}
              className="pointer-events-auto bg-inverse-surface text-inverse-on-surface rounded-xl px-5 py-4 flex items-center justify-between gap-4 shadow-xl"
            >
              <span className="font-body-md text-body-md flex-1">{toast.message}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                {toast.action && (
                  <button
                    onClick={() => {
                      toast.action!.onClick();
                      dismiss(toast.id);
                    }}
                    className="font-label-md text-label-md text-inverse-primary hover:opacity-80 transition-opacity uppercase tracking-wider"
                  >
                    {toast.action.label}
                  </button>
                )}
                <button
                  onClick={() => dismiss(toast.id)}
                  className="text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors ml-1"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext>
  );
}

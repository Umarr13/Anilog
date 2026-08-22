import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ComingSoonProps {
  children: ReactNode;
  version: string;
  title?: string;
}

export default function ComingSoon({ children, version, title = "Coming Soon" }: ComingSoonProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl">
      {/* The actual content, blurred out and non-interactive */}
      <div className="opacity-40 blur-[4px] pointer-events-none select-none transition-all duration-500 group-hover:blur-[6px]">
        {children}
      </div>
      
      {/* The Lock Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-surface-container-lowest/20">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center text-center p-6 bg-surface-container/80 backdrop-blur-md rounded-2xl border border-outline-variant/30 shadow-xl max-w-[85%]"
        >
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-primary text-[24px]">lock</span>
          </div>
          <h3 className="font-headline-sm text-on-surface mb-1">{title}</h3>
          <p className="font-label-sm text-primary font-bold tracking-wider uppercase">
            Unlocks in {version}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

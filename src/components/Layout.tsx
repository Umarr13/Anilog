import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import TopAppBar from './TopAppBar.tsx';
import BottomNavBar from './BottomNavBar.tsx';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  activeTab?: 'dashboard' | 'search' | 'add' | 'collection' | 'profile';
  showNav?: boolean;
}

export default function Layout({ children, activeTab = 'dashboard', showNav = true }: LayoutProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 7.9 Custom App-Switcher Preview Label
  useEffect(() => {
    if (activeTab) {
      const tabName = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
      document.title = `Anilog | ${tabName}`;
    }
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const showListener = Keyboard.addListener('keyboardWillShow', info => {
      setKeyboardHeight(info.keyboardHeight);
    });
    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showListener.then(l => l.remove());
      hideListener.then(l => l.remove());
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative transition-[padding] duration-300 ease-out"
      style={{ paddingBottom: keyboardHeight > 0 ? `${keyboardHeight}px` : 'max(8rem,env(safe-area-inset-bottom))' }}
    >
      {showNav && <TopAppBar activeTab={activeTab} />}
      <main className={`flex-grow max-w-desktop-max-width mx-auto px-gutter md:px-container-padding ${!showNav ? 'pt-[max(2rem,env(safe-area-inset-top))]' : 'pt-island-gap'} flex flex-col gap-island-gap w-full`}>
        {children}
      </main>
      
      {/* Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-[100px] right-6 z-40 w-12 h-12 rounded-full bg-surface-container-high/80 backdrop-blur-md border border-outline-variant/20 shadow-lg flex items-center justify-center text-primary hover:bg-surface-container-highest transition-colors active:scale-90"
            aria-label="Scroll to top"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_upward</span>
          </motion.button>
        )}
      </AnimatePresence>

      {showNav && keyboardHeight === 0 && <BottomNavBar activeTab={activeTab} />}
    </div>
  );
}

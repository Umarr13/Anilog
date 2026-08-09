import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import TopAppBar from './TopAppBar.tsx';
import BottomNavBar from './BottomNavBar.tsx';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

interface LayoutProps {
  children: ReactNode;
  activeTab?: 'dashboard' | 'search' | 'add' | 'collection' | 'profile';
  showNav?: boolean;
}

export default function Layout({ children, activeTab = 'dashboard', showNav = true }: LayoutProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  return (
    <div 
      className="min-h-screen flex flex-col relative transition-[padding] duration-300 ease-out"
      style={{ paddingBottom: keyboardHeight > 0 ? `${keyboardHeight}px` : 'max(8rem,env(safe-area-inset-bottom))' }}
    >
      {showNav && <TopAppBar activeTab={activeTab} />}
      <main className={`flex-grow max-w-desktop-max-width mx-auto px-gutter md:px-container-padding ${!showNav ? 'pt-[max(2rem,env(safe-area-inset-top))]' : 'pt-island-gap'} flex flex-col gap-island-gap w-full`}>
        {children}
      </main>
      {showNav && keyboardHeight === 0 && <BottomNavBar activeTab={activeTab} />}
    </div>
  );
}

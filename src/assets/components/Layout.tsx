import type { ReactNode } from 'react';
import TopAppBar from './TopAppBar.tsx';
import BottomNavBar from './BottomNavBar.tsx';

interface LayoutProps {
  children: ReactNode;
  activeTab?: 'dashboard' | 'search' | 'add' | 'collection' | 'profile';
  showNav?: boolean;
}

export default function Layout({ children, activeTab = 'dashboard', showNav = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col pb-32 relative">
      {showNav && <TopAppBar activeTab={activeTab} />}
      <main className="flex-grow max-w-desktop-max-width mx-auto px-gutter md:px-container-padding pt-island-gap flex flex-col gap-island-gap w-full">
        {children}
      </main>
      {showNav && <BottomNavBar activeTab={activeTab} />}
    </div>
  );
}

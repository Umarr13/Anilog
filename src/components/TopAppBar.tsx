import { Link } from 'react-router-dom';

interface TopAppBarProps {
  activeTab?: string;
}

export default function TopAppBar({ activeTab }: TopAppBarProps) {
  return (
    <header className="bg-background dark:bg-background docked full-width top-0 flex justify-between items-center w-full px-container-padding py-4 pt-[max(1rem,env(safe-area-inset-top))] sticky z-30">
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <img src="/luffy_icon.png" alt="Anilog Logo" className="w-8 h-8 rounded-full border border-primary/20 object-cover cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile uppercase tracking-widest font-black text-primary dark:text-on-primary-fixed">ANILOG</h1>
      </div>
      <div className="hidden md:flex gap-8">
        <Link to="/dashboard" className={`font-label-md text-label-md hover:opacity-80 transition-opacity ${activeTab === 'dashboard' ? 'text-secondary dark:text-secondary-fixed' : 'text-on-surface-variant dark:text-on-surface-variant'}`}>
          Dashboard
        </Link>
        <Link to="/search" className={`font-label-md text-label-md hover:opacity-80 transition-opacity ${activeTab === 'search' ? 'text-secondary dark:text-secondary-fixed' : 'text-on-surface-variant dark:text-on-surface-variant'}`}>
          Search
        </Link>
        <Link to="/collection" className={`font-label-md text-label-md hover:opacity-80 transition-opacity ${activeTab === 'collection' ? 'text-secondary dark:text-secondary-fixed' : 'text-on-surface-variant dark:text-on-surface-variant'}`}>
          Collection
        </Link>
        <Link to="#" className={`font-label-md text-label-md hover:opacity-80 transition-opacity ${activeTab === 'profile' ? 'text-secondary dark:text-secondary-fixed' : 'text-on-surface-variant dark:text-on-surface-variant'}`}>
          Profile
        </Link>
      </div>
    </header>
  );
}

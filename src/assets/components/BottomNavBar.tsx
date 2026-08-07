import { Link } from 'react-router-dom';

interface BottomNavBarProps {
  activeTab?: string;
}

export default function BottomNavBar({ activeTab }: BottomNavBarProps) {
  return (
    <nav className="md:hidden bg-surface-container-lowest dark:bg-surface-container-lowest fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md rounded-full shadow-xl dark:shadow-none border border-outline-variant/20 shadow-2xl z-50 flex justify-around items-center h-20 px-4 mb-4 mx-auto">
      {/* Dashboard */}
      <Link to="/dashboard" className={`flex flex-col items-center justify-center hover:bg-surface-container-low rounded-full transition-colors w-16 h-16 ${activeTab === 'dashboard' ? 'text-secondary dark:text-secondary font-bold' : 'text-on-surface-variant dark:text-on-surface-variant'}`}>
        <span className={`material-symbols-outlined mb-1 ${activeTab === 'dashboard' ? 'filled' : ''}`}>dashboard</span>
        <span className="font-label-sm text-label-sm hidden">Dashboard</span>
        {activeTab === 'dashboard' && <div className="w-1 h-1 bg-secondary rounded-full mt-1"></div>}
      </Link>
      
      {/* Search */}
      <Link to="/search" className={`flex flex-col items-center justify-center hover:bg-surface-container-low rounded-full transition-colors w-16 h-16 mr-8 ${activeTab === 'search' ? 'text-secondary dark:text-secondary font-bold' : 'text-on-surface-variant dark:text-on-surface-variant'}`}>
        <span className={`material-symbols-outlined mb-1 ${activeTab === 'search' ? 'filled' : ''}`}>search</span>
        <span className="font-label-sm text-label-sm hidden">Search</span>
        {activeTab === 'search' && <div className="w-1 h-1 bg-secondary rounded-full mt-1"></div>}
      </Link>
      
      {/* Add (Floating FAB in Center) */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-50">
        <button className="bg-primary text-on-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
        {/* Decorative cutout effect on the nav bar */}
        <div className="nav-curve pointer-events-none"></div>
      </div>
      
      {/* Collection */}
      <Link to="/collection" className={`flex flex-col items-center justify-center hover:bg-surface-container-low rounded-full transition-colors w-16 h-16 ml-8 ${activeTab === 'collection' ? 'text-secondary dark:text-secondary font-bold' : 'text-on-surface-variant dark:text-on-surface-variant'}`}>
        <span className={`material-symbols-outlined mb-1 ${activeTab === 'collection' ? 'filled' : ''}`}>library_books</span>
        <span className="font-label-sm text-label-sm hidden">Collection</span>
        {activeTab === 'collection' && <div className="w-1 h-1 bg-secondary rounded-full mt-1"></div>}
      </Link>
      
      {/* Profile */}
      <Link to="#" className={`flex flex-col items-center justify-center hover:bg-surface-container-low rounded-full transition-colors w-16 h-16 ${activeTab === 'profile' ? 'text-secondary dark:text-secondary font-bold' : 'text-on-surface-variant dark:text-on-surface-variant'}`}>
        <span className={`material-symbols-outlined mb-1 ${activeTab === 'profile' ? 'filled' : ''}`}>person</span>
        <span className="font-label-sm text-label-sm hidden">Profile</span>
        {activeTab === 'profile' && <div className="w-1 h-1 bg-secondary rounded-full mt-1"></div>}
      </Link>
    </nav>
  );
}

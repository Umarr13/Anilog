import { HashRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { AnimatePresence, motion } from 'framer-motion';
import { transitions, variants } from './hooks/useMotion.ts';
import { lazy, Suspense, useEffect } from 'react';
import { ToastProvider } from './components/Toast.tsx';
import Onboarding from './components/Onboarding.tsx';
import NativeBackHandler from './components/NativeBackHandler.tsx';
import FeedbackReporter from './components/FeedbackReporter.tsx';
import OfflineBanner from './components/OfflineBanner.tsx';
// import { useEpisodeNotifications } from './hooks/useEpisodeNotifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

// Eagerly loaded — it's the entry point
import Splash from './pages/Splash.tsx';

// Phase 7: Lazy-loaded pages for code-splitting
const Dashboard = lazy(() => import('./pages/Dashboard.tsx'));
const Search = lazy(() => import('./pages/Search.tsx'));
const Collection = lazy(() => import('./pages/Collection.tsx'));
const AnimeDetails = lazy(() => import('./pages/AnimeDetails.tsx'));
const Profile = lazy(() => import('./pages/Profile.tsx'));
const Recommend = lazy(() => import('./pages/Recommend.tsx'));
const SeasonalCalendar = lazy(() => import('./pages/SeasonalCalendar.tsx'));

/** Minimal loading shell shown while a lazy chunk downloads */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-md text-on-surface-variant uppercase tracking-wider">Loading…</span>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const navType = useNavigationType();
  
  // POP means the user pressed the back button or swiped back
  const isBack = navType === 'POP';

  return (
    <AnimatePresence mode="popLayout" custom={isBack}>
      <motion.div
        key={location.pathname}
        custom={isBack}
        variants={variants.directionalPage}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transitions.page}
        className="w-full min-h-screen bg-background"
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Splash />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/calendar" element={<SeasonalCalendar />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  // useEpisodeNotifications(); // Coming in v0.5.0

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    }
  }, []);
  return (
    <Sentry.ErrorBoundary fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-surface text-on-surface">
        <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
        <h1 className="text-2xl font-headline-lg mb-4 text-error">App Crashed!</h1>
        <p className="text-body-lg mb-8">We've automatically logged this error using Sentry.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-on-primary rounded-full font-label-lg"
        >
          Reload App
        </button>
      </div>
    }>
      <ToastProvider>
        <Router>
          <OfflineBanner />
          <NativeBackHandler />
          <FeedbackReporter />
          <Onboarding />
          <AnimatedRoutes />
        </Router>
      </ToastProvider>
    </Sentry.ErrorBoundary>
  );
}

export default App;

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import Splash from './pages/Splash.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Search from './pages/Search.tsx';
import Collection from './pages/Collection.tsx';
import AnimeDetails from './pages/AnimeDetails.tsx';
import Profile from './pages/Profile.tsx';
import Recommend from './pages/Recommend.tsx';
import SeasonalCalendar from './pages/SeasonalCalendar.tsx';
import { ToastProvider } from './components/Toast';
import Onboarding from './components/Onboarding';
import NativeBackHandler from './components/NativeBackHandler';

import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { useEffect } from 'react';

function App() {
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
          <NativeBackHandler />
          <Onboarding />
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/calendar" element={<SeasonalCalendar />} />
          </Routes>
        </Router>
      </ToastProvider>
    </Sentry.ErrorBoundary>
  );
}

export default App;

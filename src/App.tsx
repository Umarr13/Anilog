import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
  );
}

export default App;

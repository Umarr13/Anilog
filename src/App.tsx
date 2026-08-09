import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Search from './pages/Search.tsx';
import Collection from './pages/Collection.tsx';
import AnimeDetails from './pages/AnimeDetails.tsx';
import Profile from './pages/Profile.tsx';
import { ToastProvider } from './components/Toast';
import Onboarding from './components/Onboarding';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Onboarding />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;

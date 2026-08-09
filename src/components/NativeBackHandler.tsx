import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';

export default function NativeBackHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = async () => {
      // If we are on the dashboard, let the OS handle it (close the app)
      if (location.pathname === '/' || location.pathname === '/dashboard') {
        CapacitorApp.exitApp();
        return;
      }
      
      // Otherwise, navigate back in our React Router history
      navigate(-1);
    };

    // Listen for the native hardware back button / edge swipe
    const listener = CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      listener.then(l => l.remove());
    };
  }, [navigate, location]);

  return null;
}

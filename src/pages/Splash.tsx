import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShaderBackground from '../components/ShaderBackground.tsx';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2500); // 2.5s for splash screen
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-background text-on-background h-screen w-screen overflow-hidden flex items-center justify-center relative">
      {/* Background Shader */}
      <ShaderBackground />

      {/* Main Splash Content Container */}
      <div className="flex flex-col items-center justify-center relative z-10 w-full px-margin-mobile md:px-margin-desktop">
        {/* App Icon with Animation */}
        <div className="mb-stack-md opacity-0 animate-splash-enter shadow-[0_20px_60px_rgba(0,0,0,0.06)] rounded-xl bg-surface">
          <img
            alt="Anilog App Icon"
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border border-outline-variant/30"
            src="/luffy_icon.png"
          />
        </div>

        {/* Typography */}
        <h1 className="font-brand-logo text-brand-logo text-primary uppercase tracking-[0.4em] opacity-0 animate-text-fade mt-stack-xs text-center">
          ANILOG
        </h1>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-outline-variant/30 overflow-hidden">
        <div className="h-full bg-primary absolute animate-loading-line"></div>
      </div>
    </div>
  );
}

/**
 * OfflineBanner — Feature #9
 * Subtle top banner that slides in when the device loses network connectivity.
 * Tells users why Search/AniList features don't work instead of silently failing.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          key="offline-banner"
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[200] bg-error text-on-error flex items-center justify-center gap-2 py-2 px-4 text-sm font-label-md shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <span className="material-symbols-outlined text-[18px]">wifi_off</span>
          <span>You're offline — search & AniList features unavailable</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

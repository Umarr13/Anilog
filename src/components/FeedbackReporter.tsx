import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Capacitor } from '@capacitor/core';
import { db } from '../data/db';
import { useToast } from './Toast';
import { transitions, variants } from '../hooks/useMotion';

// 7.7 In-App Feedback & Crash Capture System
export default function FeedbackReporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const { showToast } = useToast();
  
  const handleOpen = async () => {
    setIsCapturing(true);
    
    try {
      // 7.7.3 One-Tap Screenshot
      const canvas = await html2canvas(document.body, {
        ignoreElements: (element) => element.id === 'feedback-reporter-trigger',
        useCORS: true,
        scale: 1 // Lower scale for smaller payload size
      });
      setScreenshot(canvas.toDataURL('image/webp', 0.5));
    } catch (e) {
      console.error('Screenshot failed:', e);
    }
    
    setIsCapturing(false);
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const context = {
      url: window.location.href,
      platform: Capacitor.getPlatform(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    try {
      // 7.7.5 Local Report Queue (Works Offline)
      await db.reports.add({
        comment,
        screenshotBase64: screenshot || '',
        context,
        status: 'pending',
        createdAt: Date.now()
      });
      
      // 7.7.6 Silent Submission to GitHub Issues (Attempt)
      const token = import.meta.env.VITE_GITHUB_FEEDBACK_TOKEN;
      if (token) {
        // Build markdown body
        const body = `### User Feedback
${comment || '_No comment provided_'}

**Context**
- URL: \`${context.url}\`
- Platform: \`${context.platform}\`

![Screenshot](${screenshot})
`;
        await fetch('https://api.github.com/repos/Umarr13/Anilog/issues', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            title: `App Feedback: ${comment ? comment.substring(0, 30) + '...' : 'Silent Report'}`,
            body,
            labels: ['user-report']
          })
        });
        
        // If successful, mark submitted (simplistic implementation)
        const lastReport = await db.reports.orderBy('id').last();
        if (lastReport && lastReport.id) {
           await db.reports.update(lastReport.id, { status: 'submitted' });
        }
      }
      
      // 7.7.8 In-App "You Reported This" Confirmation
      showToast('Thanks — flagged.');
      setIsOpen(false);
      setComment('');
      setScreenshot(null);
    } catch (e) {
      showToast('Report saved locally. Will sync later.');
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 7.7.2 "Something's Wrong" Floating Flag Button */}
      <button
        id="feedback-reporter-trigger"
        onClick={handleOpen}
        disabled={isCapturing}
        className="fixed bottom-[130px] md:bottom-12 left-4 z-50 w-12 h-12 bg-surface hover:bg-surface-container shadow-lg border border-surface-variant rounded-full flex items-center justify-center text-on-surface-variant transition-transform hover:scale-110 active:scale-95"
        title="Report an issue"
      >
        <span className={`material-symbols-outlined ${isCapturing ? 'animate-spin' : ''}`}>
          {isCapturing ? 'refresh' : 'flag'}
        </span>
      </button>

      {/* Report Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsOpen(false)}
            />
            
            <motion.div
              className="relative w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl p-6 border border-surface-variant/30"
              variants={variants.fadeSlideUp}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transitions.spring}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-headline-md text-primary text-xl">Flag an Issue</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-variant text-on-surface-variant"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              {screenshot && (
                <div className="mb-4 relative rounded-xl overflow-hidden border-2 border-primary/20 aspect-[9/16] max-h-[250px] w-full flex justify-center bg-black/10">
                   <img src={screenshot} alt="Captured Screen" className="object-contain h-full" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none flex flex-col justify-end p-2">
                     <span className="text-white text-xs font-label-caps">Screenshot Attached</span>
                   </div>
                </div>
              )}
              
              {/* 7.7.4 Optional One-Line Comment */}
              <textarea
                className="w-full bg-surface-container rounded-xl p-4 font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24 mb-6"
                placeholder="What happened? (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-3 rounded-full font-label-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">send</span>
                )}
                Submit Report
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

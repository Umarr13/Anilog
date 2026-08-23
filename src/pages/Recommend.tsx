import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type AnimeEntry } from '../data/db';
import Layout from '../components/Layout';
import SwipeBack from '../components/SwipeBack';
import ComingSoon from '../components/ComingSoon';
import { transitions, variants } from '../hooks/useMotion';

const questions = [
  {
    id: 'length',
    question: 'How much time do you have?',
    options: [
      { label: 'Short & Sweet (12-24 eps)', value: 'short' },
      { label: 'In for the Long Haul (25+ eps)', value: 'long' },
      { label: 'Doesn\'t Matter', value: 'any' }
    ]
  },
  {
    id: 'vibe',
    question: 'What vibe are you going for?',
    options: [
      { label: 'Action & Adventure', value: 'action' },
      { label: 'Chill & Slice of Life', value: 'chill' },
      { label: 'Dark & Psychological', value: 'dark' },
      { label: 'Romance & Drama', value: 'romance' },
      { label: 'Surprise Me', value: 'any' }
    ]
  },
  {
    id: 'era',
    question: 'New or Classic?',
    options: [
      { label: 'Modern (2015+)', value: 'modern' },
      { label: 'Classic (Pre-2015)', value: 'classic' },
      { label: 'Anything is Fine', value: 'any' }
    ]
  }
];

export default function Recommend() {
  const navigate = useNavigate();
  const planToWatch = useLiveQuery(() => db.anime.where('status').equals('plan_to_watch').toArray()) || [];
  
  const [source, setSource] = useState<'unselected' | 'mood' | 'watched'>('unselected');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<AnimeEntry | null>(null);
  
  const handleAnswer = (optionValue: string) => {
    const currentQ = questions[step];
    const newAnswers = { ...answers, [currentQ.id]: optionValue };
    setAnswers(newAnswers);
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      generateRecommendation(newAnswers);
    }
  };

  const generateWatchedRecommendation = async () => {
    try {
      const res = await fetch('/watched_suggestions.json');
      if (res.ok) {
        const pool = await res.json();
        if (pool.length > 0) {
          const randomPick = pool[Math.floor(Math.random() * pool.length)];
          setRecommendation(randomPick as AnimeEntry);
          setStep(100);
          return;
        }
      }
      setStep(98); // 98 = watched empty state
    } catch (e) {
      setStep(98);
    }
  };
  
  const generateRecommendation = async (finalAnswers: Record<string, string>) => {
    let pool = [...planToWatch];
    
    // If Plan to Watch is empty, fetch from the Python-generated suggestions dataset
    if (pool.length === 0) {
      try {
        const res = await fetch('/suggestions.json');
        if (res.ok) {
          pool = await res.json();
        } else {
          setStep(99); // 99 = empty state
          return;
        }
      } catch (e) {
        setStep(99);
        return;
      }
    }
    
    // Simple filtering based on answers
    let filteredPool = [...pool];
    
    if (finalAnswers['length'] === 'short') {
      filteredPool = filteredPool.filter(a => a.episodes && a.episodes <= 26);
    } else if (finalAnswers['length'] === 'long') {
      filteredPool = filteredPool.filter(a => !a.episodes || a.episodes > 26);
    }
    
    if (finalAnswers.vibe !== 'any') {
      const vibeMap: Record<string, string[]> = {
        action: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
        chill: ['Slice of Life', 'Comedy', 'Iyashikei'],
        dark: ['Psychological', 'Horror', 'Thriller', 'Mystery'],
        romance: ['Romance', 'Drama']
      };
      
      const targetGenres = vibeMap[finalAnswers.vibe];
      filteredPool = filteredPool.filter(a => a.genres?.some((g: string) => targetGenres.includes(g)));
    }
    
    if (finalAnswers.era === 'modern') {
      filteredPool = filteredPool.filter(a => a.year && a.year >= 2015);
    } else if (finalAnswers.era === 'classic') {
      filteredPool = filteredPool.filter(a => a.year && a.year < 2015);
    }
    
    // If filtering was too strict and pool is empty, fallback to the unfiltered pool
    if (filteredPool.length === 0) {
      filteredPool = pool;
    }
    
    // Pick a random anime from the pool
    const randomPick = filteredPool[Math.floor(Math.random() * filteredPool.length)];
    setRecommendation(randomPick as AnimeEntry);
    setStep(100); // 100 = result state
  };

  return (
    <SwipeBack>
      <Layout showNav={false}>
        <div className="flex flex-col h-full min-h-[80vh] justify-center items-center relative">
          
          <button 
            className="absolute top-0 left-0 text-on-surface-variant hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-surface-container z-10"
            onClick={() => {
              if (step === 100 || step === 99 || step === 98) {
                setStep(0);
                setSource('unselected');
              } else if (source !== 'unselected') {
                setSource('unselected');
                setStep(0);
                setAnswers({});
              } else {
                navigate(-1);
              }
            }}
          >
            <span className="material-symbols-outlined">
              {(source !== 'unselected' || step === 100 || step === 99 || step === 98) ? 'arrow_back' : 'close'}
            </span>
          </button>
          
          {source === 'unselected' && (
            <motion.div
              className="w-full max-w-md bg-surface-container-lowest rounded-2xl island-shadow p-8 flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={transitions.default}
            >
              <h2 className="font-headline-lg text-headline-lg text-primary mb-8">How should we suggest?</h2>
              
              <div className="flex flex-col gap-4 w-full">
                <button
                  onClick={() => setSource('mood')}
                  className="w-full py-6 px-6 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container hover:border-secondary transition-colors active:scale-[0.98] flex flex-col items-center gap-2"
                >
                  <span className="material-symbols-outlined text-3xl text-primary">psychology</span>
                  <span className="font-label-lg text-on-surface">Mood-based Pick</span>
                  <span className="font-body-sm text-on-surface-variant">Answer a few questions</span>
                </button>

                <ComingSoon version="0.1.5" title="Based on Watched">
                  <button
                    onClick={() => {
                      setSource('watched');
                      generateWatchedRecommendation();
                    }}
                    className="w-full py-6 px-6 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container hover:border-secondary transition-colors active:scale-[0.98] flex flex-col items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-3xl text-secondary">history</span>
                    <span className="font-label-lg text-on-surface">Based on Watched</span>
                    <span className="font-body-sm text-on-surface-variant">Custom Python AI Suggestions</span>
                  </button>
                </ComingSoon>
              </div>
            </motion.div>
          )}

          {source === 'mood' && step < questions.length && (
            <motion.div 
              key={step}
              className="w-full max-w-md bg-surface-container-lowest rounded-2xl island-shadow p-8 flex flex-col items-center text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={transitions.default}
            >
              <div className="flex gap-2 mb-8">
                {questions.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-secondary' : 'w-4 bg-surface-container-high'}`} />
                ))}
              </div>
              
              <h2 className="font-headline-lg text-headline-lg text-primary mb-8">{questions[step].question}</h2>
              
              <div className="flex flex-col gap-4 w-full">
                {questions[step].options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="w-full py-4 px-6 rounded-xl border border-outline-variant/30 font-label-lg text-on-surface hover:bg-surface-container-low hover:border-secondary transition-colors active:scale-[0.98]"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 98 && (
            <motion.div
              className="w-full max-w-md bg-surface-container-lowest rounded-2xl island-shadow p-8 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="material-symbols-outlined text-6xl text-secondary mb-4">error</span>
              <h2 className="font-headline-lg text-primary mb-2">No Suggestions Found</h2>
              <p className="font-body-md text-on-surface-variant mb-6">Make sure you have run the custom python script to generate 'watched_suggestions.json'.</p>
              <button onClick={() => { setStep(0); setSource('unselected'); }} className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Go Back
              </button>
            </motion.div>
          )}

          {step === 99 && (
            <motion.div
              className="w-full max-w-md bg-surface-container-lowest rounded-2xl island-shadow p-8 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="material-symbols-outlined text-6xl text-secondary mb-4">sentiment_dissatisfied</span>
              <h2 className="font-headline-lg text-primary mb-2">Nothing to Recommend</h2>
              <p className="font-body-md text-on-surface-variant mb-6">Your Plan to Watch list is empty! Add some anime first.</p>
              <Link to="/search" className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">search</span>
                Find Anime
              </Link>
            </motion.div>
          )}

          {step === 100 && recommendation && (
            <motion.div
              className="w-full max-w-md bg-surface-container-lowest rounded-2xl island-shadow p-6 flex flex-col items-center"
              variants={variants.fadeSlideUp}
              initial="initial"
              animate="animate"
            >
              <h2 className="font-headline-sm text-on-surface-variant mb-6 uppercase tracking-widest text-sm">We Recommend</h2>
              
              <Link to={`/anime/${recommendation.id}`} className="w-full aspect-[3/4] rounded-xl overflow-hidden relative group block mb-6 shadow-lg">
                <img 
                  src={recommendation.image} 
                  alt={recommendation.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="text-white font-headline-lg text-lg truncate">{recommendation.title}</h3>
                  <p className="text-white/80 font-body-sm text-sm">{recommendation.genres?.slice(0,2).join(', ')}</p>
                </div>
              </Link>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => { 
                    setStep(0); 
                    setAnswers({}); 
                    if (source === 'watched') generateWatchedRecommendation();
                  }} 
                  className="flex-1 py-3 rounded-lg border border-outline-variant text-on-surface font-label-md hover:bg-surface-container-low transition-colors"
                >
                  Try Again
                </button>
                <Link 
                  to={`/anime/${recommendation.id}`}
                  className="flex-1 py-3 rounded-lg bg-primary text-on-primary font-label-md hover:bg-surface-tint transition-colors flex items-center justify-center"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </Layout>
    </SwipeBack>
  );
}

/**
 * Dashboard — Phase 3 upgrades:
 * 3.5  Empty state with CTA when no watching anime
 * 3.9  Staggered animation on stat bento cards
 */
import Layout from '../components/Layout.tsx';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { db } from '../data/db';
import { transitions, variants } from '../hooks/useMotion';

export default function Dashboard() {
  const allAnime = useLiveQuery(() => db.anime.toArray()) || [];
  
  const watching = allAnime.filter(a => a.status === 'watching');
  const completed = allAnime.filter(a => a.status === 'completed');
  const planToWatch = allAnime.filter(a => a.status === 'plan_to_watch');
  
  // Get the most recently updated "watching" anime
  const currentFocus = watching.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  
  const scoredAnime = allAnime.filter(a => a.score > 0);
  const avgScore = scoredAnime.length > 0 
    ? (scoredAnime.reduce((acc, curr) => acc + curr.score, 0) / scoredAnime.length).toFixed(1)
    : '-';

  const statCards = [
    { label: 'Completed', value: completed.length, delay: 0 },
    { label: 'Watching', value: watching.length, delay: 0.05 },
    { label: 'Plan to Watch', value: planToWatch.length, delay: 0.1 },
    { label: 'Avg Score', value: avgScore, isScore: true, delay: 0.15 },
  ];

  return (
    <Layout activeTab="dashboard">
      {/* Current Focus Island */}
      {currentFocus ? (
        <motion.section
          className="bg-surface-container-lowest rounded-2xl island-shadow p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center mb-8"
          variants={variants.fadeSlideUp}
          initial="initial"
          animate="animate"
          transition={transitions.page}
        >
          {/* Image Area */}
          <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-80 rounded-xl overflow-hidden bg-surface-container relative flex-shrink-0 cursor-pointer">
            <Link to={`/anime/${currentFocus.id}`}>
              <img
                alt="Current Focus Artwork"
                className="w-full h-full object-cover object-top mix-blend-multiply transition-transform hover:scale-105 duration-700"
                src={currentFocus.image}
              />
              <div className="absolute inset-0 border border-outline-variant/10 rounded-xl pointer-events-none"></div>
            </Link>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-surface-container text-primary font-label-sm text-label-sm rounded-[4px] uppercase tracking-wider">Currently Watching</span>
            </div>
            <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2 hover:underline cursor-pointer">
              <Link to={`/anime/${currentFocus.id}`}>{currentFocus.title}</Link>
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4 max-w-md">
              Progress: {currentFocus.currentEpisode} / {currentFocus.episodes || '?'}
            </p>
            {/* Progress bar */}
            <div className="w-full max-w-xs h-2 bg-surface-container-high rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full bg-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentFocus.episodes ? (currentFocus.currentEpisode / currentFocus.episodes) * 100 : 50}%` }}
                transition={{ ...transitions.default, delay: 0.3 }}
              />
            </div>
            <Link to={`/anime/${currentFocus.id}`} className="bg-primary text-on-primary font-label-md text-label-md py-4 px-8 rounded-lg hover:opacity-90 transition-opacity active:scale-95 w-full md:w-auto flex items-center justify-center gap-2">
              <span className="material-symbols-outlined filled">play_arrow</span>
              Resume
            </Link>
          </div>
        </motion.section>
      ) : (
        /* 3.5 — Contextual empty state */
        <motion.section
          className="bg-surface-container-lowest rounded-2xl island-shadow p-12 flex flex-col items-center text-center mb-8"
          variants={variants.fadeSlideUp}
          initial="initial"
          animate="animate"
          transition={transitions.page}
        >
          <span className="material-symbols-outlined text-6xl text-secondary mb-4">movie</span>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">No Active Anime</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-sm">Search for an anime to start tracking your progress.</p>
          <Link to="/search" className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md hover:opacity-90 transition-opacity active:scale-95 inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">search</span>
            Explore Anime
          </Link>
        </motion.section>
      )}

      {/* Quick Stats Bento — 3.9 staggered */}
      <motion.section
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={variants.staggerContainer}
        initial="initial"
        animate="animate"
      >
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            className="bg-surface-container-lowest rounded-2xl island-shadow p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300"
            variants={variants.staggerChild}
            transition={{ ...transitions.default, delay: card.delay }}
          >
            <span className={`font-headline-lg text-headline-lg mb-1 ${card.isScore ? 'text-secondary' : 'text-primary'}`}>
              {card.value}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{card.label}</span>
          </motion.div>
        ))}
      </motion.section>
    </Layout>
  );
}

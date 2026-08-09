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
  
  // Get the 4 most recently updated "watching" anime
  const recentFocus = watching.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);
  
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
      {/* 4.29 Time-of-Day Greeting */}
      <motion.div 
        className="mb-6 mt-2"
        variants={variants.fadeSlideUp}
        initial="initial"
        animate="animate"
      >
        <h2 className="font-headline-md text-on-surface-variant">
          {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'},
        </h2>
        <h1 className="font-headline-xl text-primary mt-1">Your Anime Journey</h1>
      </motion.div>

      {/* Current Focus Bento Grid */}
      {recentFocus.length > 0 ? (
        <motion.section
          className="grid grid-cols-2 gap-4 mb-8"
          variants={variants.staggerContainer}
          initial="initial"
          animate="animate"
        >
          {recentFocus.map((anime, index) => (
            <motion.div
              key={anime.id}
              className="bg-surface-container-lowest rounded-2xl island-shadow p-3 flex flex-col relative overflow-hidden group"
              variants={variants.staggerChild}
              transition={{ ...transitions.default, delay: index * 0.1 }}
            >
              <Link to={`/anime/${anime.id}`} className="block h-full flex flex-col">
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface-container relative mb-3">
                  <img
                    alt={anime.title}
                    className="w-full h-full object-cover object-top mix-blend-multiply transition-transform group-hover:scale-105 duration-700"
                    src={anime.image}
                  />
                  <div className="absolute inset-0 border border-outline-variant/10 rounded-xl pointer-events-none"></div>
                  
                  {/* Gradient Overlay for Text */}
                  <div className="absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end overflow-hidden">
                    <div className="w-full relative">
                      <h3 className="text-white font-headline-sm text-sm hover:animate-marquee whitespace-nowrap">{anime.title}</h3>
                    </div>
                    <p className="text-white/80 font-body-sm text-xs">Ep {anime.currentEpisode} / {anime.episodes || '?'}</p>
                  </div>
                </div>
                
                {/* Progress bar at bottom */}
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-auto">
                  <motion.div
                    className="h-full bg-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${anime.episodes ? (anime.currentEpisode / anime.episodes) * 100 : 50}%` }}
                    transition={{ ...transitions.default, delay: 0.3 + (index * 0.1) }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
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

      {/* Quick Actions (Phase 4) */}
      <motion.section 
        className="flex gap-4 mb-8 overflow-x-auto pb-2 snap-x"
        variants={variants.fadeSlideUp}
        initial="initial"
        animate="animate"
      >
        <Link to="/calendar" className="snap-start flex-shrink-0 w-[200px] bg-secondary text-on-secondary rounded-2xl island-shadow p-4 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <span className="material-symbols-outlined text-3xl mb-4">calendar_month</span>
          <div>
            <h3 className="font-headline-sm">Airing Calendar</h3>
            <p className="font-body-sm text-on-secondary/80 mt-1">What's out today</p>
          </div>
        </Link>
        <Link to="/recommend" className="snap-start flex-shrink-0 w-[200px] bg-surface-container-high text-on-surface rounded-2xl island-shadow p-4 flex flex-col justify-between hover:-translate-y-1 transition-transform border border-outline-variant/30">
          <span className="material-symbols-outlined text-3xl mb-4 text-primary">psychology</span>
          <div>
            <h3 className="font-headline-sm text-primary">Suggest an Anime</h3>
            <p className="font-body-sm text-on-surface-variant mt-1">Mood-based pick</p>
          </div>
        </Link>
      </motion.section>

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

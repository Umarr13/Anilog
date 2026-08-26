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
import { getDashboardPriorityCard } from '../lib/dashboardPriority';

export default function Dashboard() {
  const allAnime = useLiveQuery(() => db.anime.toArray()) || [];
  
  const watching = allAnime.filter(a => a.status === 'watching' || a.status === 'rewatching');
  const completed = allAnime.filter(a => a.status === 'completed');
  const planToWatch = allAnime.filter(a => a.status === 'plan_to_watch');
  
  // "Where Was I?" — single most recently updated active show
  const resumeCard = [...watching].sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null;

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

  const priorityCard = getDashboardPriorityCard(allAnime);

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

      {/* Adaptive "Right Now" Dashboard Card */}
      <motion.section
        className="mb-8"
        variants={variants.fadeSlideUp}
        initial="initial"
        animate="animate"
      >
        {priorityCard.type === 'quote' ? (
          priorityCard.anime ? (
            <Link to={`/anime/${priorityCard.anime.id}`} className="block w-full">
              <div className="bg-surface-container-high rounded-3xl island-shadow p-6 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-primary to-secondary mix-blend-overlay"></div>
                <h3 className="font-headline-sm text-secondary mb-2 uppercase tracking-widest text-xs">A moment of reflection</h3>
                <p className="font-headline-md text-on-surface mb-4 leading-relaxed">"{priorityCard.quote?.quote}"</p>
                <div className="flex items-center gap-3">
                  {priorityCard.anime.image && (
                    <img src={priorityCard.anime.image} alt={priorityCard.anime.title} className="w-8 h-8 rounded-full object-cover" />
                  )}
                  <p className="font-body-sm text-on-surface-variant">— {priorityCard.quote?.character}, <span className="italic">{priorityCard.quote?.anime}</span></p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-surface-container-high rounded-3xl island-shadow p-6 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-primary to-secondary mix-blend-overlay"></div>
              <h3 className="font-headline-sm text-secondary mb-2 uppercase tracking-widest text-xs">A moment of reflection</h3>
              <p className="font-headline-md text-on-surface mb-4 leading-relaxed">"{priorityCard.quote?.quote}"</p>
              <p className="font-body-sm text-on-surface-variant">— {priorityCard.quote?.character}, <span className="italic">{priorityCard.quote?.anime}</span></p>
            </div>
          )
        ) : priorityCard.anime ? (
          <Link to={`/anime/${priorityCard.anime.id}`} className="block w-full">
            <div className="bg-surface-container-lowest rounded-3xl island-shadow overflow-hidden group flex border border-outline-variant/30 h-36">
              <div className="w-1/3 h-full relative">
                <img src={priorityCard.anime.image} alt={priorityCard.anime.title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-2/3 p-5 flex flex-col justify-center">
                <h3 className="font-headline-sm text-primary mb-1 uppercase tracking-widest text-[10px]">
                  {priorityCard.type === 'finish_soon' ? 'Almost Done' : priorityCard.type === 'new_episode' ? 'New Episode' : priorityCard.type === 'resume_watching' ? 'Pick Back Up' : 'Suggested for You'}
                </h3>
                <h2 className="font-headline-md text-on-surface line-clamp-1 mb-2">{priorityCard.anime.title}</h2>
                <p className="font-body-sm text-on-surface-variant line-clamp-2">{priorityCard.message}</p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-surface-container-lowest rounded-3xl island-shadow p-6 flex flex-col items-center text-center">
             <span className="material-symbols-outlined text-4xl text-secondary mb-3">explore</span>
             <h3 className="font-headline-sm text-primary mb-1">Time to Explore</h3>
             <p className="font-body-sm text-on-surface-variant">{priorityCard.message}</p>
             <Link to="/search" className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-full font-label-md">Search</Link>
          </div>
        )}
      </motion.section>
      {/* Feature #6 — "Where Was I?" Resume Card */}
      {resumeCard && (
          <motion.section
            className="mb-6"
            variants={variants.fadeSlideUp}
            initial="initial"
            animate="animate"
          >
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-xs mb-3 px-1">Where Was I?</p>
            <Link to={`/anime/${resumeCard.id}`} className="block">
              <div className="bg-surface-container-lowest rounded-2xl island-shadow p-4 flex items-center gap-4 border border-outline-variant/20 hover:-translate-y-0.5 transition-transform">
                <img
                  src={resumeCard.image}
                  alt={resumeCard.title}
                  className="w-14 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-label-sm text-secondary uppercase tracking-wider text-[10px] mb-0.5">
                    {resumeCard.status === 'rewatching' ? `Rewatch #${resumeCard.rewatchCount ?? 1}` : 'Continue Watching'}
                  </p>
                  <h3 className="font-headline-sm text-primary truncate">{resumeCard.title}</h3>
                  <p className="font-body-sm text-on-surface-variant text-xs mt-0.5">
                    Ep {resumeCard.currentEpisode} / {resumeCard.episodes ?? '?'}
                  </p>
                  {resumeCard.episodes && (
                    <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-secondary rounded-full transition-all"
                        style={{ width: `${(resumeCard.currentEpisode / resumeCard.episodes) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">play_circle</span>
              </div>
            </Link>
          </motion.section>
      )}

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
              <Link to={`/anime/${anime.id}`} className="flex flex-col h-full">
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface-container relative mb-3">
                  <motion.img
                    layoutId={`anime-cover-${anime.id}`}
                    alt={anime.title}
                    className="blur-up w-full h-full object-cover object-top mix-blend-multiply transition-transform group-hover:scale-105 duration-700"
                    src={anime.image}
                    onLoad={(e) => e.currentTarget.classList.add('loaded')}
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

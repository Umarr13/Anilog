/**
 * AnimeDetails — Phase 3 upgrades:
 * 3.1  SwipeBack gesture wrapper
 * 3.2  Optimistic UI with SaveIndicator
 * 3.6  Skeleton loader while fetching
 * 3.7  Bigger star tap targets (44×44px minimum)
 * 3.9  Consistent motion via framer-motion
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAnimeDetails, type AniListAnime } from '../api/anilist';
import { db, type AnimeEntry } from '../data/db';
import { useLiveQuery } from 'dexie-react-hooks';
import SwipeBack from '../components/SwipeBack';
import SaveIndicator from '../components/SaveIndicator';
import Skeleton from '../components/Skeleton';
import { useToast } from '../components/Toast';
import { transitions, variants } from '../hooks/useMotion';

export default function AnimeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const animeId = parseInt(id || '0', 10);
  const { showToast } = useToast();

  const [anilistData, setAnilistData] = useState<AniListAnime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveFlash, setSaveFlash] = useState(false);

  // 1. Check local DB
  const localEntry = useLiveQuery(() => db.anime.get(animeId), [animeId]);

  // 2. If not in local DB (or if we want fresh info), fetch from AniList
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAnimeDetails(animeId);
        setAnilistData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load details');
      } finally {
        setLoading(false);
      }
    }
    
    if (animeId > 0) {
      fetchData();
    }
  }, [animeId]);

  // 3.2 — Flash a checkmark briefly after saves
  const flashSave = useCallback(() => {
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1200);
  }, []);

  const handleAddToCollection = async (status: AnimeEntry['status']) => {
    if (!anilistData) return;
    
    await db.anime.put({
      id: anilistData.id,
      title: anilistData.title.english || anilistData.title.romaji,
      romajiTitle: anilistData.title.romaji,
      episodes: anilistData.episodes,
      currentEpisode: 0,
      status: status,
      score: 0,
      image: anilistData.coverImage.large || anilistData.coverImage.extraLarge,
      bannerImage: anilistData.bannerImage,
      description: anilistData.description,
      genres: anilistData.genres,
      year: anilistData.seasonYear,
      studios: anilistData.studios?.nodes?.map(n => n.name) || [],
      updatedAt: Date.now()
    });

    showToast(`Added to ${status.replace('_', ' ')}`, {
      action: {
        label: 'Undo',
        onClick: () => db.anime.delete(anilistData.id),
      },
    });
  };

  // 3.2 — Optimistic episode update
  const handleUpdateProgress = async (delta: number) => {
    if (!localEntry) return;
    let newEp = localEntry.currentEpisode + delta;
    if (newEp < 0) newEp = 0;
    if (localEntry.episodes && newEp > localEntry.episodes) newEp = localEntry.episodes;
    
    // Optimistic: DB write happens, LiveQuery auto-updates the UI
    await db.anime.update(animeId, { currentEpisode: newEp, updatedAt: Date.now() });
    flashSave();
  };

  // 3.2 — Optimistic score update
  const handleUpdateScore = async (score: number) => {
    if (!localEntry) return;
    await db.anime.update(animeId, { score, updatedAt: Date.now() });
    flashSave();
  };

  // 3.6 — Skeleton while loading
  if (loading && !localEntry) {
    return (
      <SwipeBack>
        <div className="min-h-screen flex flex-col pb-32 relative bg-background text-on-surface antialiased">
          <header className="bg-background docked full-width top-0 z-40 sticky">
            <div className="flex justify-between items-center w-full px-container-padding py-4 max-w-desktop-max-width mx-auto">
              <button 
                className="text-on-surface-variant hover:opacity-80 transition-opacity flex items-center justify-center p-2 rounded-full hover:bg-surface-container"
                onClick={() => navigate(-1)}
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile uppercase tracking-widest font-black text-primary">ANILOG</h1>
              <div className="w-10" />
            </div>
          </header>
          <main className="max-w-desktop-max-width mx-auto px-gutter md:px-container-padding pt-8 flex flex-col gap-island-gap w-full">
            <Skeleton variant="detail" />
          </main>
        </div>
      </SwipeBack>
    );
  }

  if (error && !localEntry && !anilistData) {
    return (
      <SwipeBack>
        <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
          <motion.div 
            className="text-center"
            variants={variants.fadeSlideUp}
            initial="initial"
            animate="animate"
            transition={transitions.default}
          >
            <span className="material-symbols-outlined text-6xl text-error mb-4 block">error_outline</span>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Anime not found</h2>
            <p className="text-error mb-6 font-body-md text-body-md">{error}</p>
            <button className="bg-primary text-on-primary font-label-md py-3 px-8 rounded-lg hover:opacity-90 transition-opacity" onClick={() => navigate(-1)}>Go Back</button>
          </motion.div>
        </div>
      </SwipeBack>
    );
  }

  // Derive data to display: favor AniList for static metadata, LocalDB for user state
  const displayTitle = anilistData?.title.english || anilistData?.title.romaji || localEntry?.title;
  const displayRomaji = anilistData?.title.romaji || localEntry?.romajiTitle;
  const displayImage = anilistData?.coverImage.large || anilistData?.coverImage.extraLarge || localEntry?.image;
  const displayDesc = anilistData?.description || localEntry?.description;
  const displayEpisodes = anilistData?.episodes || localEntry?.episodes;
  const displayStatus = anilistData?.status || 'UNKNOWN';
  const displayAvgScore = anilistData?.averageScore ? (anilistData.averageScore / 10).toFixed(1) : 'N/A';

  const userStatus = localEntry?.status;
  const userProgress = localEntry?.currentEpisode || 0;
  const userScore = localEntry?.score || 0;

  return (
    <SwipeBack>
      <div className="min-h-screen flex flex-col pb-32 relative bg-background text-on-surface antialiased">
        {/* Top App Bar */}
        <header className="bg-background dark:bg-background docked full-width top-0 z-40 sticky">
          <div className="flex justify-between items-center w-full px-container-padding py-4 max-w-desktop-max-width mx-auto">
            <button 
              className="text-on-surface-variant hover:opacity-80 transition-opacity flex items-center justify-center p-2 rounded-full hover:bg-surface-container"
              onClick={() => navigate(-1)}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile uppercase tracking-widest font-black text-primary dark:text-on-primary-fixed">ANILOG</h1>
            <button className="text-on-surface-variant hover:opacity-80 transition-opacity flex items-center justify-center p-2 rounded-full hover:bg-surface-container">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </header>

        <motion.main
          className="max-w-desktop-max-width mx-auto px-gutter md:px-container-padding pt-8 flex flex-col gap-island-gap w-full"
          variants={variants.fadeSlideUp}
          initial="initial"
          animate="animate"
          transition={transitions.page}
        >
          {/* Hero Section */}
          <section className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-full md:w-1/2 flex justify-center">
              <motion.div 
                className="bg-surface-container-lowest rounded-xl p-8 island-shadow w-full max-w-sm aspect-[3/4] flex items-center justify-center relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...transitions.default, delay: 0.1 }}
              >
                <img 
                  className="w-full h-full object-contain" 
                  src={displayImage} 
                  alt={`${displayTitle} Cover`} 
                />
              </motion.div>
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-surface-container-low text-primary font-label-sm text-label-sm rounded mb-3">TV Series</span>
                <h2 className="font-headline-xl text-headline-xl text-primary">{displayTitle}</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">{displayRomaji}</p>
              </div>
              
              <div className="flex gap-12 py-6 border-y border-outline-variant/20">
                <div>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Score</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary filled">star</span>
                    <span className="font-headline-lg text-headline-lg">{displayAvgScore}</span>
                  </div>
                </div>
                <div>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Status</span>
                  <div className="flex items-center gap-2 h-full">
                    <span className="font-body-lg text-body-lg capitalize">{displayStatus.toLowerCase()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant" dangerouslySetInnerHTML={{ __html: displayDesc || '' }}></p>
              </div>

              {/* Collection Actions (if not in collection) */}
              {!localEntry && (
                <motion.div 
                  className="flex gap-4 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transitions.default, delay: 0.3 }}
                >
                  <button 
                    onClick={() => handleAddToCollection('watching')}
                    className="bg-primary text-on-primary font-label-md py-3 px-6 rounded-lg hover:opacity-90 transition-opacity active:scale-95"
                  >
                    Start Watching
                  </button>
                  <button 
                    onClick={() => handleAddToCollection('plan_to_watch')}
                    className="bg-surface-container-high text-on-surface font-label-md py-3 px-6 rounded-lg hover:opacity-90 transition-opacity active:scale-95"
                  >
                    Plan to Watch
                  </button>
                </motion.div>
              )}
            </div>
          </section>

          {/* Personal Log (Only if in collection) */}
          {localEntry && (
            <motion.section
              className="bg-surface-container-lowest rounded-xl p-8 island-shadow flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transitions.default, delay: 0.2 }}
            >
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Personal Log</h3>
                <div className="flex gap-2 items-center">
                  <span className="px-3 py-1 bg-surface-container text-secondary font-label-sm text-label-sm rounded-[4px] uppercase tracking-wider">
                    {userStatus?.replace('_', ' ')}
                  </span>
                  <SaveIndicator visible={saveFlash} />
                  <button className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-tint transition-colors">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Progress */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Progress</label>
                  <div className="flex items-center gap-4">
                    <span className="font-headline-lg text-headline-lg">{userProgress}</span>
                    <span className="font-body-lg text-body-lg text-on-surface-variant">/ {displayEpisodes || '?'}</span>
                    <div className="flex gap-2 ml-auto">
                      <button 
                        onClick={() => handleUpdateProgress(-1)} 
                        className="w-12 h-12 rounded-full border border-primary flex items-center justify-center hover:bg-surface-container-low transition-colors active:scale-90"
                      >
                        <span className="material-symbols-outlined text-primary">remove</span>
                      </button>
                      <button 
                        onClick={() => handleUpdateProgress(1)} 
                        className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-surface-tint transition-colors active:scale-90"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* 3.7 — Bigger star tap targets (44×44px) */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">My Rating</label>
                  <div className="flex items-center gap-1 h-full">
                    {[2, 4, 6, 8, 10].map(starValue => (
                      <button 
                        key={starValue} 
                        onClick={() => handleUpdateScore(starValue)}
                        className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:scale-90"
                        aria-label={`Rate ${starValue} out of 10`}
                      >
                        <span className={`material-symbols-outlined text-[28px] transition-colors ${userScore >= starValue ? 'filled text-secondary' : 'text-surface-variant'}`}>star</span>
                      </button>
                    ))}
                    <span className="ml-3 font-body-lg text-body-lg">{userScore} / 10</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-2">Notes</label>
                <div className="w-full min-h-[120px] bg-background border border-outline-variant/20 rounded-lg p-4 font-body-md text-body-md text-on-surface">
                  Tap edit to add notes. (Feature coming soon)
                </div>
              </div>
            </motion.section>
          )}
        </motion.main>
      </div>
    </SwipeBack>
  );
}

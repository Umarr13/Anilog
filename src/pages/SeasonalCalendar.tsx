import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SwipeBack from '../components/SwipeBack';
import Skeleton from '../components/Skeleton';
import { variants } from '../hooks/useMotion';
import { ANILIST_API_URL } from '../api/anilist';
import { db } from '../data/db';
import { useLiveQuery } from 'dexie-react-hooks';

const calendarQuery = `
query {
  Page(page: 1, perPage: 50) {
    media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
      id
      title { romaji english }
      coverImage { large }
      nextAiringEpisode {
        airingAt
        episode
      }
      genres
    }
  }
}
`;

export default function SeasonalCalendar() {
  const [airingAnime, setAiringAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const collection = useLiveQuery(() => db.anime.toArray()) || [];

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await fetch(ANILIST_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: calendarQuery })
        });
        const data = await res.json();
        
        // Filter out those without next airing episode and sort by airing time
        const schedule = data.data.Page.media
          .filter((a: any) => a.nextAiringEpisode)
          .sort((a: any, b: any) => a.nextAiringEpisode.airingAt - b.nextAiringEpisode.airingAt);
          
        setAiringAnime(schedule);
      } catch {
        setError('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
  }, []);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Group by day of week
  const groupedByDay = airingAnime.reduce((acc: Record<string, any[]>, anime: any) => {
    const date = new Date(anime.nextAiringEpisode.airingAt * 1000);
    const day = daysOfWeek[date.getDay()];
    if (!acc[day]) acc[day] = [];
    acc[day].push(anime);
    return acc;
  }, {} as Record<string, any[]>);

  // Reorder days starting from today
  const todayIndex = new Date().getDay();
  const orderedDays = [
    ...daysOfWeek.slice(todayIndex),
    ...daysOfWeek.slice(0, todayIndex)
  ];

  return (
    <SwipeBack>
      <Layout showNav={true}>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-primary mb-2">Airing Calendar</h2>
            <p className="font-body-md text-on-surface-variant">What's releasing this week.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-error font-body-md">{error}</div>
        ) : (
          <motion.div 
            className="flex flex-col gap-12 pb-8"
            variants={variants.staggerContainer}
            initial="initial"
            animate="animate"
          >
            {orderedDays.map(day => {
              const animes = groupedByDay[day];
              if (!animes || animes.length === 0) return null;
              
              const isToday = day === daysOfWeek[todayIndex];

              return (
                <motion.section key={day} variants={variants.staggerChild}>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className={`font-headline-md text-headline-md ${isToday ? 'text-secondary' : 'text-primary'}`}>
                      {isToday ? 'Today' : day}
                    </h3>
                    <div className="h-px bg-outline-variant/30 flex-grow"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {animes.map((anime: any) => {
                      const date = new Date(anime.nextAiringEpisode.airingAt * 1000);
                      const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      const isInCollection = collection.some(c => c.id === anime.id);

                      return (
                        <Link key={anime.id} to={`/anime/${anime.id}`} className="group relative rounded-xl overflow-hidden bg-surface-container aspect-[3/4] island-shadow flex flex-col justify-end p-3">
                          <img 
                            src={anime.coverImage.large} 
                            alt={anime.title.english || anime.title.romaji}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-x-0 bottom-0 p-3 pt-12 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end z-10">
                            <h4 className="text-white font-headline-sm text-sm truncate">{anime.title.english || anime.title.romaji}</h4>
                            <p className="text-white/80 font-body-sm text-xs mt-1 flex justify-between">
                              <span>Ep {anime.nextAiringEpisode.episode}</span>
                              <span className="text-secondary">{timeString}</span>
                            </p>
                          </div>
                          {isInCollection && (
                            <div className="absolute top-2 right-2 z-10 bg-secondary/90 text-on-secondary rounded-full w-6 h-6 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </motion.section>
              );
            })}
          </motion.div>
        )}
      </Layout>
    </SwipeBack>
  );
}

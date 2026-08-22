/**
 * Search — Phase 3 upgrades:
 * 3.4  Persistent search query via sessionStorage
 * 3.5  Empty state with CTA when no results
 * 3.6  Skeleton loaders while fetching
 * 3.9  Staggered card animations via framer-motion
 */
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout.tsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchAnime, getTrendingAnime, getTopRatedAnime, getHiddenGems, type AniListAnime } from '../api/anilist';
import Skeleton from '../components/Skeleton';
import { transitions, variants } from '../hooks/useMotion';

const SEARCH_QUERY_KEY = 'anilog_search_query';

export default function Search() {
  const [searchParams] = useSearchParams();
  // 3.4 — Restore search query from sessionStorage (or from ?genre= deep-link)
  const [query, setQuery] = useState(() => {
    const genreParam = searchParams.get('genre');
    if (genreParam) return genreParam;
    return sessionStorage.getItem(SEARCH_QUERY_KEY) || '';
  });
  const [results, setResults] = useState<AniListAnime[]>([]);
  const [trending, setTrending] = useState<AniListAnime[]>([]);
  const [discoverTab, setDiscoverTab] = useState<'trending' | 'top_rated' | 'hidden_gems'>('trending');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('anilog_recent_searches') || '[]'); } catch { return []; }
  });
  // Use a ref so the effect can always read the latest value without being a dep
  const recentSearchesRef = useRef(recentSearches);
  recentSearchesRef.current = recentSearches;

  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 3.4 — Persist search query
  useEffect(() => {
    sessionStorage.setItem(SEARCH_QUERY_KEY, query);
  }, [query]);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      setError('');
      try {
        if (query.trim() === '') {
          let trend: AniListAnime[];
          if (discoverTab === 'top_rated') {
            trend = await getTopRatedAnime();
          } else if (discoverTab === 'hidden_gems') {
            trend = await getHiddenGems();
          } else {
            trend = await getTrendingAnime();
          }
          setResults(trend);
          setTrending(trend.slice(0, 4));
        } else {
          const searchRes = await searchAnime(query);
          setResults(searchRes);
          // Use ref to avoid stale closure AND prevent re-fetch loop
          const current = recentSearchesRef.current;
          if (searchRes.length > 0 && !current.includes(query)) {
            const newRecent = [query, ...current].slice(0, 5);
            setRecentSearches(newRecent);
            localStorage.setItem('anilog_recent_searches', JSON.stringify(newRecent));
          }
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch anime';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchAnime();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, discoverTab]); // re-fetch when discover tab changes

  // Bug Fix: Scroll to top on mount so search input is always visible (even on back navigation)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout activeTab="search">
      {/* Search Section */}
      <section className="flex flex-col gap-stack-xs w-full max-w-2xl mx-auto relative z-20">
        <label className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.15em]" htmlFor="search-input">Search Titles</label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-0 text-secondary pointer-events-none">search</span>
          <input
            className="input-underline w-full pl-8 font-body-lg text-body-lg text-primary placeholder:text-secondary-fixed-dim bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors"
            id="search-input"
            placeholder="Search AniList..."
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* Clear button */}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-0 text-on-surface-variant hover:text-primary transition-colors p-1"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}

          {/* 4.12 Recent Searches */}
          {isFocused && query.trim() === '' && recentSearches.length > 0 && (
            <motion.div 
              className="absolute top-full mt-2 left-0 right-0 bg-surface-container-low rounded-xl island-shadow flex flex-col p-2 border border-outline-variant/10 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center px-4 py-2 text-on-surface-variant">
                <span className="font-label-sm uppercase tracking-wider">Recent Searches</span>
                <button onClick={() => { setRecentSearches([]); localStorage.removeItem('anilog_recent_searches'); }} className="text-xs hover:text-primary">Clear</button>
              </div>
              {recentSearches.map(term => (
                <button 
                  key={term} 
                  onClick={() => setQuery(term)} 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container rounded-lg text-left transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">history</span>
                  <span className="font-body-md text-primary">{term}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="flex flex-col gap-stack-md w-full mt-8">
        {/* Discover tabs (only when no active query) */}
        {!query && (
          <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
            {([['trending', 'Trending'], ['top_rated', 'Top Rated'], ['hidden_gems', 'Hidden Gems']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setDiscoverTab(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-label-md text-sm transition-colors border ${
                  discoverTab === key
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          {query ? 'Search Results' : discoverTab === 'top_rated' ? 'Top Rated All Time' : discoverTab === 'hidden_gems' ? 'Hidden Gems' : 'Trending Now'}
        </h2>


        {/* 3.6 — Skeleton loaders */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            <Skeleton variant="card" count={6} />
          </div>
        ) : error ? (
          <motion.div
            className="text-center py-12"
            variants={variants.fadeSlideUp}
            initial="initial"
            animate="animate"
            transition={transitions.default}
          >
            <span className="material-symbols-outlined text-5xl text-error mb-3 block">wifi_off</span>
            <p className="text-error font-body-lg text-body-lg mb-2">{error}</p>
            <p className="text-on-surface-variant font-body-md text-body-md">Check your connection and try again.</p>
          </motion.div>
        ) : (
          /* 3.9 — Staggered card animation */
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
            variants={variants.staggerContainer}
            initial="initial"
            animate="animate"
            key={query || '__trending'}
          >
            {results.length > 0 ? (
              results.map(anime => (
                <motion.div
                  key={anime.id}
                  variants={variants.staggerChild}
                  transition={transitions.default}
                >
                  <Link
                    to={`/anime/${anime.id}`}
                    className="flex gap-4 p-4 border border-surface-variant rounded-xl island-shadow bg-surface-container-lowest hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                  >
                    <div className="w-16 h-24 bg-surface-variant flex-shrink-0 relative overflow-hidden rounded">
                      <motion.img
                        layoutId={`anime-cover-${anime.id}`}
                        className="blur-up absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply transition-all duration-500"
                        src={anime.coverImage.large || anime.coverImage.extraLarge}
                        alt={anime.title.romaji || anime.title.english}
                        onLoad={(e) => e.currentTarget.classList.add('loaded')}
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1 overflow-hidden">
                      <h3 className="font-body-lg text-body-lg text-primary leading-tight truncate">{anime.title.romaji || anime.title.english}</h3>
                      <p className="font-body-sm text-body-sm text-secondary truncate">{anime.genres.slice(0, 2).join(' • ')}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-secondary text-[14px]">star</span>
                        <span className="font-label-caps text-label-caps text-secondary">
                          {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full flex flex-col items-center text-center py-16"
                variants={variants.fadeSlideUp}
                initial="initial"
                animate="animate"
                transition={transitions.default}
              >
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-4">search_off</span>
                <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-2">No results found</h3>
                <p className="text-on-surface-variant font-body-md text-body-md mb-8">
                  No anime matched "{query}". Check out these popular titles instead:
                </p>
                
                {/* 4.31 Smart Empty Search State */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  {trending.slice(0, 4).map(anime => (
                    <Link
                      key={anime.id}
                      to={`/anime/${anime.id}`}
                      className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl island-shadow p-2 flex flex-col gap-2 hover:-translate-y-1 transition-transform"
                    >
                       <img src={anime.coverImage.large} alt="" className="w-full h-24 object-cover rounded" />
                       <span className="font-label-sm text-sm truncate w-full text-primary">{anime.title.english || anime.title.romaji}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </section>
    </Layout>
  );
}

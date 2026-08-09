/**
 * Search — Phase 3 upgrades:
 * 3.4  Persistent search query via sessionStorage
 * 3.5  Empty state with CTA when no results
 * 3.6  Skeleton loaders while fetching
 * 3.9  Staggered card animations via framer-motion
 */
import { useState, useEffect } from 'react';
import Layout from '../components/Layout.tsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchAnime, getTrendingAnime, type AniListAnime } from '../api/anilist';
import Skeleton from '../components/Skeleton';
import { transitions, variants } from '../hooks/useMotion';

const SEARCH_QUERY_KEY = 'anilog_search_query';

export default function Search() {
  // 3.4 — Restore search query from sessionStorage
  const [query, setQuery] = useState(() => sessionStorage.getItem(SEARCH_QUERY_KEY) || '');
  const [results, setResults] = useState<AniListAnime[]>([]);
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
          const trending = await getTrendingAnime();
          setResults(trending);
        } else {
          const searchRes = await searchAnime(query);
          setResults(searchRes);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch anime');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchAnime();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <Layout activeTab="search">
      {/* Search Section */}
      <section className="flex flex-col gap-stack-xs w-full max-w-2xl mx-auto">
        <label className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.15em]" htmlFor="search-input">Search Titles</label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-0 text-secondary pointer-events-none">search</span>
          <input
            className="input-underline w-full pl-8 font-body-lg text-body-lg text-primary placeholder:text-secondary-fixed-dim bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors"
            id="search-input"
            placeholder="Search AniList..."
            type="text"
            value={query}
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
        </div>
      </section>

      {/* Results Section */}
      <section className="flex flex-col gap-stack-md w-full mt-8">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          {query ? 'Search Results' : 'Trending Now'}
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
                      <img
                        className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply transition-all duration-500"
                        src={anime.coverImage.large || anime.coverImage.extraLarge}
                        alt={anime.title.romaji || anime.title.english}
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
              /* 3.5 — Empty state with CTA */
              <motion.div
                className="col-span-full flex flex-col items-center text-center py-16"
                variants={variants.fadeSlideUp}
                initial="initial"
                animate="animate"
                transition={transitions.default}
              >
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-4">search_off</span>
                <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-2">No results found</h3>
                <p className="text-on-surface-variant font-body-md text-body-md mb-6">
                  No anime matched "{query}". Try a different title or spelling.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md hover:opacity-90 transition-opacity active:scale-95"
                >
                  Browse Trending
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </section>
    </Layout>
  );
}

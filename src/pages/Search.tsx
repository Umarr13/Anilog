import { useState, useEffect } from 'react';
import Layout from '../components/Layout.tsx';
import { Link } from 'react-router-dom';
import { searchAnime, getTrendingAnime, type AniListAnime } from '../api/anilist';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AniListAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        </div>
      </section>

      {/* Results Section */}
      <section className="flex flex-col gap-stack-md w-full mt-8">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          {query ? 'Search Results' : 'Trending Now'}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-error">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {results.length > 0 ? (
              results.map(anime => (
                <Link key={anime.id} to={`/anime/${anime.id}`} className="flex gap-4 p-4 border border-surface-variant rounded-xl island-shadow bg-surface-container-lowest hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
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
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-on-surface-variant">
                No results found for "{query}". Try another search term.
              </div>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
}

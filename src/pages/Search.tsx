import { useState } from 'react';
import Layout from '../components/Layout.tsx';
import { Link } from 'react-router-dom';
import { animeData } from '../data/animeData';

export default function Search() {
  const [query, setQuery] = useState('');

  const filteredAnime = animeData.filter(anime => 
    anime.title.toLowerCase().includes(query.toLowerCase()) || 
    anime.romajiTitle.toLowerCase().includes(query.toLowerCase()) ||
    anime.genres.some(g => g.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <Layout activeTab="search">
      {/* Search Section */}
      <section className="flex flex-col gap-stack-xs w-full max-w-2xl mx-auto">
        <label className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.15em]" htmlFor="search-input">Search Titles, Genres, Studios</label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-0 text-secondary pointer-events-none">search</span>
          <input
            className="input-underline w-full pl-8 font-body-lg text-body-lg text-primary placeholder:text-secondary-fixed-dim bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors"
            id="search-input"
            placeholder="Enter keywords..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-4 mt-4 overflow-x-auto pb-2 no-scrollbar">
          <button className="font-label-caps text-label-caps text-secondary hover:text-primary hover:underline transition-all whitespace-nowrap" onClick={() => setQuery('Ongoing')}>Currently Airing</button>
          <button className="font-label-caps text-label-caps text-secondary hover:text-primary hover:underline transition-all whitespace-nowrap" onClick={() => setQuery('')}>Highest Rated</button>
          <button className="font-label-caps text-label-caps text-secondary hover:text-primary hover:underline transition-all whitespace-nowrap" onClick={() => setQuery('Action')}>Action</button>
          <button className="font-label-caps text-label-caps text-secondary hover:text-primary hover:underline transition-all whitespace-nowrap" onClick={() => setQuery('Fantasy')}>Fantasy</button>
        </div>
      </section>

      {/* Results Section */}
      <section className="flex flex-col gap-stack-md w-full mt-8">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          {query ? 'Search Results' : 'Trending Now'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredAnime.length > 0 ? (
            filteredAnime.map(anime => (
              <Link key={anime.id} to={`/anime/${anime.id}`} className="flex gap-4 p-4 border border-surface-variant rounded-xl island-shadow bg-surface-container-lowest hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                <div className="w-16 h-24 bg-surface-variant flex-shrink-0 relative overflow-hidden rounded">
                  <img
                    className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale hover:grayscale-0 transition-all duration-500"
                    src={anime.image}
                    alt={anime.title}
                  />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <h3 className="font-body-lg text-body-lg text-primary leading-tight">{anime.title}</h3>
                  <p className="font-body-sm text-body-sm text-secondary">{anime.genres.slice(0, 2).join(' • ')}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="material-symbols-outlined text-secondary text-[14px]">star</span>
                    <span className="font-label-caps text-label-caps text-secondary">{anime.score || 'N/A'}</span>
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
      </section>
    </Layout>
  );
}

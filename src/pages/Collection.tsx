import { useState } from 'react';
import Layout from '../components/Layout.tsx';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

export default function Collection() {
  const [activeTab, setActiveTab] = useState(0);
  const statuses = ['completed', 'watching', 'plan_to_watch'] as const;
  const filteredAnime = useLiveQuery(
    () => db.anime.where('status').equals(statuses[activeTab]).toArray(),
    [activeTab]
  ) || [];

  return (
    <Layout activeTab="collection">
      {/* Header Section */}
      <div className="mb-4 md:mb-8">
        <h2 className="font-headline-xl text-headline-xl text-primary mb-2">My Collection</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Track your anime journey.</p>
      </div>

      {/* Tabs Island */}
      <div className="bg-surface-container-lowest rounded-xl p-2 flex relative floating-island mb-8 overflow-x-auto no-scrollbar">
        <button
          className={`flex-1 py-3 px-6 text-center rounded-lg font-label-md text-label-md transition-colors relative z-10 whitespace-nowrap ${activeTab === 0 ? 'text-primary bg-surface-container-low' : 'text-on-surface-variant hover:bg-surface-container/50'}`}
          onClick={() => setActiveTab(0)}
        >
          Watched
        </button>
        <button
          className={`flex-1 py-3 px-6 text-center rounded-lg font-label-md text-label-md transition-colors relative z-10 whitespace-nowrap ${activeTab === 1 ? 'text-primary bg-surface-container-low' : 'text-on-surface-variant hover:bg-surface-container/50'}`}
          onClick={() => setActiveTab(1)}
        >
          Watching
        </button>
        <button
          className={`flex-1 py-3 px-6 text-center rounded-lg font-label-md text-label-md transition-colors relative z-10 whitespace-nowrap ${activeTab === 2 ? 'text-primary bg-surface-container-low' : 'text-on-surface-variant hover:bg-surface-container/50'}`}
          onClick={() => setActiveTab(2)}
        >
          Plan to Watch
        </button>
      </div>

      {/* Collection List */}
      <div className="space-y-4 animate-slide-in">
        {filteredAnime.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-on-surface-variant mb-4">Your collection is empty.</p>
            <Link to="/search" className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md hover:bg-surface-tint">Search for anime to add</Link>
          </div>
        ) : (
          filteredAnime.map(anime => (
            <Link key={anime.id} to={`/anime/${anime.id}`} className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 floating-island hover:scale-[1.01] transition-transform cursor-pointer block">
              <img
                className="w-16 h-16 rounded-lg object-cover bg-surface-container-low border border-surface-variant"
                src={anime.image}
                alt={`${anime.title} Thumbnail`}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-label-md text-label-md text-primary truncate">{anime.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm truncate">{anime.episodes ? `${anime.episodes} Episodes` : 'Ongoing'} • {anime.genres.join(', ')}</p>
              </div>
              <div className="text-right pl-4 border-l border-surface-variant">
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary block">{anime.score ? Math.round(anime.score * 10) / 10 : '-'}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">/10</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Floating Action Button - Desktop only */}
      <div className="hidden md:flex fixed bottom-12 right-12 z-50">
        <button className="flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface-container border border-surface-dim rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all hover:scale-105 active:scale-95 group">
          <span className="material-symbols-outlined text-primary text-[20px]">add</span>
          <span className="font-label-caps text-label-caps text-primary group-hover:text-primary transition-colors">Add to Collection</span>
        </button>
      </div>
    </Layout>
  );
}

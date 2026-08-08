import Layout from '../components/Layout.tsx';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

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

  return (
    <Layout activeTab="dashboard">
      {/* Current Focus Island */}
      {currentFocus ? (
        <section className="bg-surface-container-lowest rounded-2xl island-shadow p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center mb-8">
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
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md">
              Progress: {currentFocus.currentEpisode} / {currentFocus.episodes || '?'}
            </p>
            <Link to={`/anime/${currentFocus.id}`} className="bg-primary text-on-primary font-label-md text-label-md py-4 px-8 rounded-lg hover:opacity-90 transition-opacity w-full md:w-auto flex items-center justify-center gap-2">
              <span className="material-symbols-outlined filled">play_arrow</span>
              Resume
            </Link>
          </div>
        </section>
      ) : (
        <section className="bg-surface-container-lowest rounded-2xl island-shadow p-12 flex flex-col items-center text-center mb-8">
          <span className="material-symbols-outlined text-6xl text-secondary mb-4">movie</span>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">No Active Anime</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Search for an anime to start tracking your progress.</p>
          <Link to="/search" className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md hover:bg-surface-tint">
            Explore Anime
          </Link>
        </section>
      )}

      {/* Quick Stats Bento */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl island-shadow p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
          <span className="font-headline-lg text-headline-lg text-primary mb-1">{completed.length}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Completed</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl island-shadow p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 delay-75">
          <span className="font-headline-lg text-headline-lg text-primary mb-1">{watching.length}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Watching</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl island-shadow p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 delay-150">
          <span className="font-headline-lg text-headline-lg text-primary mb-1">{planToWatch.length}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Plan to Watch</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl island-shadow p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 delay-200">
          <span className="font-headline-lg text-headline-lg text-secondary mb-1">{avgScore}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Avg Score</span>
        </div>
      </section>
    </Layout>
  );
}

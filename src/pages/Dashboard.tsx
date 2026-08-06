import Layout from '../components/Layout.tsx';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <Layout activeTab="dashboard">
      {/* Sanity Gauge Island */}
      <section className="bg-surface-container-lowest rounded-2xl island-shadow p-8 flex flex-col items-center justify-center">
        <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-6">Current Sanity</h2>
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Circular progress track */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle className="text-surface-container-high" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="2"></circle>
            {/* Progress (approx 75%) */}
            <circle className="text-primary transition-all duration-1000 ease-out" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="283" strokeDashoffset="70" strokeWidth="4"></circle>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-headline-xl text-headline-xl text-primary">75%</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Stable</span>
          </div>
        </div>
      </section>

      {/* Current Focus Island */}
      <section className="bg-surface-container-lowest rounded-2xl island-shadow p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
        {/* Image Area */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-80 rounded-xl overflow-hidden bg-surface-container relative flex-shrink-0 cursor-pointer">
          <Link to="/anime/one-piece">
            <img 
              alt="Current Focus Artwork" 
              className="w-full h-full object-cover object-top mix-blend-multiply transition-transform hover:scale-105 duration-700" 
              src="/luffy_icon.png" 
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
            <Link to="/anime/one-piece">One Piece</Link>
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md">
            Arc: Egghead Island<br />
            Episode: 1093
          </p>
          <button className="bg-primary text-on-primary font-label-md text-label-md py-4 px-8 rounded-lg hover:opacity-90 transition-opacity w-full md:w-auto flex items-center justify-center gap-2">
            <span className="material-symbols-outlined filled">play_arrow</span>
            Resume
          </button>
        </div>
      </section>

      {/* Quick Stats Bento */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl island-shadow p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
          <span className="font-headline-lg text-headline-lg text-primary mb-1">12</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Completed</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl island-shadow p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 delay-75">
          <span className="font-headline-lg text-headline-lg text-primary mb-1">3</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Watching</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl island-shadow p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 delay-150">
          <span className="font-headline-lg text-headline-lg text-primary mb-1">45</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Plan to Watch</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl island-shadow p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 delay-200">
          <span className="font-headline-lg text-headline-lg text-secondary mb-1">9.5</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Avg Score</span>
        </div>
      </section>
    </Layout>
  );
}

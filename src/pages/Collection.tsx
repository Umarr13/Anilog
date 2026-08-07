import { useState } from 'react';
import Layout from '../assets/components/Layout.tsx';
import { Link } from 'react-router-dom';

export default function Collection() {
  const [activeTab, setActiveTab] = useState(0);

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
        {/* Item 1 */}
        <Link to="/anime/cyberpunk" className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 floating-island hover:scale-[1.01] transition-transform cursor-pointer block">
          <img
            className="w-16 h-16 rounded-lg object-cover bg-surface-container-low border border-surface-variant"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMSA3A42czP-t-30nOxFeHO6O-roc_4SqkHsuMXEI2j3WrDBzSgPiNslY6HCCiT_KPBNLSWizUyvBswKALplGJjh3NCcEqNl0shmuA-Bh_i1gGYkAEm_g0aX6CI_lYRbh4KenQ7Q2mdO5yoA-QDc8n8L9KAp7jsqBFGI6yXDmLiFmzcI6WI9xvPpwSnYST4nf-UDaLGlc83oI9RaZmwDiYsfluRhaERTjl2nQ3WLYwGgVeqzmvJcJo"
            alt="Cyberpunk Thumbnail"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-label-md text-label-md text-primary truncate">Cyberpunk: Edgerunners</h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm truncate">10 Episodes • Sci-Fi, Action</p>
          </div>
          <div className="text-right pl-4 border-l border-surface-variant">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary block">9.5</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">/10</span>
          </div>
        </Link>

        {/* Item 2 */}
        <Link to="/anime/jujutsu" className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 floating-island hover:scale-[1.01] transition-transform cursor-pointer block">
          <img
            className="w-16 h-16 rounded-lg object-cover bg-surface-container-low border border-surface-variant"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZzfKm3dGXTzK4es7eAl2MVnUzGqh5MQ_9zwmYh4MSZsG_JZ4FS6zqT2yAhWP85rQ6ZnuFmR-3TEouP7ivbQc8vEfDhavdi_PA6LU6fsc_v-ANRMHsoxh0QkZw3JLRZIbS2CB_BeeL6rrWAAsUa9mxI0wxqBbOJcWGvM0CkffpfhI4Dbxvd5qb9xo3J_Ef55tNaZTgb1tBZ9GudIdu8GpWQPq4jBW4Yw01HvBFpl3VEcRqrpvqmNBM"
            alt="Jujutsu Kaisen 0 Thumbnail"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-label-md text-label-md text-primary truncate">Jujutsu Kaisen 0</h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm truncate">Movie • Action, Supernatural</p>
          </div>
          <div className="text-right pl-4 border-l border-surface-variant">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary block">9.0</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">/10</span>
          </div>
        </Link>

        {/* Item 3 */}
        <Link to="/anime/aot" className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 floating-island hover:scale-[1.01] transition-transform cursor-pointer block">
          <img
            className="w-16 h-16 rounded-lg object-cover bg-surface-container-low border border-surface-variant"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUg9pXHDL_7gtm88hlf6E_saY-DOzyhp56Ic1Fe3pS2uZdKZuMjzl_-xlooqAQqWaIxw6vDxs5EI12C6zmzg8AP7SDoPAgLDUo8b59HH8hNbJcC44Q2aV0k_kqOqiBjSH4ZvGr-mYSEit9vfpSv6NEtG4P6pvFWjEOwGRwxXic61YkOXLENi765giXogy4XsxlcIVULRix7WRmjiZwEmB4SAjwmYtwLjY2Y14L4HfwzFnR1iIX505B"
            alt="Attack on Titan Thumbnail"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-label-md text-label-md text-primary truncate">Attack on Titan</h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm truncate">87 Episodes • Action, Drama</p>
          </div>
          <div className="text-right pl-4 border-l border-surface-variant">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary block">9.8</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">/10</span>
          </div>
        </Link>

        {/* Item 4 */}
        <Link to="/anime/spirited-away" className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 floating-island hover:scale-[1.01] transition-transform cursor-pointer block">
          <div className="w-16 h-16 rounded-lg bg-surface-container-high border border-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant">movie</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-label-md text-label-md text-primary truncate">Spirited Away</h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm truncate">Movie • Fantasy, Adventure</p>
          </div>
          <div className="text-right pl-4 border-l border-surface-variant">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary block">10</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">/10</span>
          </div>
        </Link>
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

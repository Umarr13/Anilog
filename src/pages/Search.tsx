import Layout from '../assets/components/Layout.tsx';
import { Link } from 'react-router-dom';

export default function Search() {
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
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-4 mt-4 overflow-x-auto pb-2 no-scrollbar">
          <button className="font-label-caps text-label-caps text-secondary hover:text-primary hover:underline transition-all whitespace-nowrap">Currently Airing</button>
          <button className="font-label-caps text-label-caps text-secondary hover:text-primary hover:underline transition-all whitespace-nowrap">Highest Rated</button>
          <button className="font-label-caps text-label-caps text-secondary hover:text-primary hover:underline transition-all whitespace-nowrap">Sci-Fi</button>
          <button className="font-label-caps text-label-caps text-secondary hover:text-primary hover:underline transition-all whitespace-nowrap">Slice of Life</button>
        </div>
      </section>

      {/* Trending Section */}
      <section className="flex flex-col gap-stack-md w-full mt-8">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Trending Now</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {/* Trending Item 1 */}
          <Link to="/anime/neon-genesis" className="flex gap-4 p-4 border border-surface-variant rounded-xl island-shadow bg-surface-container-lowest hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <div className="w-16 h-24 bg-surface-variant flex-shrink-0 relative overflow-hidden rounded">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz7kFnsmD4oQDMFkz7rN1RLccXzmXLx1k9wha-lYWzOahX0fTPSiXMYg7SWhK7RMnOJaT3tn3AoBrDT0w-omBSYW_IvnZzi8meHMwyi1EN4dEC3FiUKqwOo8B_1tk-GGdJRsOK8W3_s-gAT6lRF_TevdDbwy_gbVaPU9euuqpxY5ndHQmbsaWenEuMV5NYEGPfX6xYT8CExSXS2DFMzPui3hRfyKFEdUQeS2lTupgC60TP0BqR5a1G"
                alt="Neon Genesis Rebuild"
              />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <h3 className="font-body-lg text-body-lg text-primary leading-tight">Neon Genesis Rebuild</h3>
              <p className="font-body-sm text-body-sm text-secondary">Sci-Fi • Mecha</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-secondary text-[14px]">star</span>
                <span className="font-label-caps text-label-caps text-secondary">8.9</span>
              </div>
            </div>
          </Link>

          {/* Trending Item 2 */}
          <Link to="/anime/journeys-end" className="flex gap-4 p-4 border border-surface-variant rounded-xl island-shadow bg-surface-container-lowest hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <div className="w-16 h-24 bg-surface-variant flex-shrink-0 relative overflow-hidden rounded">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-NnHAkdtxJMNc7Z0KUPgpUdxp0Gy-Vy7B7Yv6G8n1gs-f9FqIVqB101vnn5Cpx0atbUPwP2XEXJ_BAH8l45ITEgITJ-F7yg9UGcjd2x6YeG7UK_mJAsy29Q3KRYXbW2RUIScDsAULg4u0IV5Mp6jnWrSmmnnrSqx_zvFGp8DhM5qZ6h3FxBA5VQQSyGOuNlnZso5nJDU6cSJMNgPiTiqWsAOTfNLhFVtiXXKri2sy4trhYlG5-9w5"
                alt="Journey's End"
              />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <h3 className="font-body-lg text-body-lg text-primary leading-tight">Journey's End</h3>
              <p className="font-body-sm text-body-sm text-secondary">Drama • Fantasy</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-secondary text-[14px]">star</span>
                <span className="font-label-caps text-label-caps text-secondary">9.1</span>
              </div>
            </div>
          </Link>

          {/* Trending Item 3 */}
          <Link to="/anime/blade-protocol" className="flex gap-4 p-4 border border-surface-variant rounded-xl island-shadow bg-surface-container-lowest hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <div className="w-16 h-24 bg-surface-variant flex-shrink-0 relative overflow-hidden rounded">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA90OoUsQoqe6zJ7YWvA5Aqe1kmXZ0pIy8_6iPVlgEa33jhkdG7saPZ7PdnOJ-Vfx84sosmNB-U86qyZBoT8LJZZdkb1I7XNXxqZPmQa8vgPDHKmXLmg3m-ebyHJgKFC3__6yOCi6HZ6_9zwSQZlhjs8y_lnjN-RlF1go2sl3zCUjmXmKm1PQLWlK3i9zIGYCqzR95uYuIuv-jHx7i-3l5FO1PC4oNCIPsDus1f07ozgqGtnr6gVBE"
                alt="Blade Protocol"
              />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <h3 className="font-body-lg text-body-lg text-primary leading-tight">Blade Protocol</h3>
              <p className="font-body-sm text-body-sm text-secondary">Action • Cyberpunk</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-secondary text-[14px]">star</span>
                <span className="font-label-caps text-label-caps text-secondary">8.4</span>
              </div>
            </div>
          </Link>

          {/* Trending Item 4 */}
          <Link to="/anime/abyss-drifter" className="flex gap-4 p-4 border border-surface-variant rounded-xl island-shadow bg-surface-container-lowest hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <div className="w-16 h-24 bg-surface-variant flex-shrink-0 relative overflow-hidden rounded">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC-dwcADUUbP9x7FXbRck5Q67sFYGsW8s_DTFLJXkKMJ8EF-4kmI3P313gauvQNWiCHLFWwUdi_bwMHp6mvyzXZupHIWESRcBvdBrUJXKTGvAPfneo0kvBcrTbNjB5xVJDfhlF2SmtnKVdSan8w98QrmnT2kUAgnW0U_93trFJeKmQDx6QPKnnlhjowELf9mKXSPV9sQSiRq-vATAXIHFhgS8sVeQHUSYrEpQtYuxfZpaWUcprRDSC"
                alt="Abyss Drifter"
              />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <h3 className="font-body-lg text-body-lg text-primary leading-tight">Abyss Drifter</h3>
              <p className="font-body-sm text-body-sm text-secondary">Mystery • Sci-Fi</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-secondary text-[14px]">star</span>
                <span className="font-label-caps text-label-caps text-secondary">8.7</span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

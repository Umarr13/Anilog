import { useNavigate } from 'react-router-dom';

export default function AnimeDetails() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col pb-32 relative bg-background text-on-surface antialiased">
      {/* Top App Bar (Custom for details page) */}
      <header className="bg-background dark:bg-background docked full-width top-0 z-40 sticky">
        <div className="flex justify-between items-center w-full px-container-padding py-4 max-w-desktop-max-width mx-auto">
          <button 
            className="text-on-surface-variant hover:opacity-80 transition-opacity flex items-center justify-center p-2 rounded-full hover:bg-surface-container"
            onClick={() => navigate(-1)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile uppercase tracking-widest font-black text-primary dark:text-on-primary-fixed">ANILOG</h1>
          <button className="text-on-surface-variant hover:opacity-80 transition-opacity flex items-center justify-center p-2 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      <main className="max-w-desktop-max-width mx-auto px-gutter md:px-container-padding pt-8 flex flex-col gap-island-gap w-full">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="bg-surface-container-lowest rounded-xl p-8 island-shadow w-full max-w-sm aspect-[3/4] flex items-center justify-center relative overflow-hidden">
              <img 
                className="w-full h-full object-contain" 
                src="/luffy_icon.png" 
                alt="Anime Details Cover" 
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-surface-container-low text-primary font-label-sm text-label-sm rounded mb-3">TV Series</span>
              <h2 className="font-headline-xl text-headline-xl text-primary">One Piece</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Pirate King</p>
            </div>
            
            <div className="flex gap-12 py-6 border-y border-outline-variant/20">
              <div>
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Score</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary filled">star</span>
                  <span className="font-headline-lg text-headline-lg">9.2</span>
                </div>
              </div>
              <div>
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Status</span>
                <div className="flex items-center gap-2 h-full">
                  <span className="font-body-lg text-body-lg">Watching</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger. The famous mystery treasure named "One Piece".
              </p>
            </div>
          </div>
        </section>

        {/* Personal Log */}
        <section className="bg-surface-container-lowest rounded-xl p-8 island-shadow flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Personal Log</h3>
            <button className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-tint transition-colors">
              <span className="material-symbols-outlined">edit</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Progress</label>
              <div className="flex items-center gap-4">
                <span className="font-headline-lg text-headline-lg">1071</span>
                <span className="font-body-lg text-body-lg text-on-surface-variant">/ ?</span>
                <div className="flex gap-2 ml-auto">
                  <button className="w-12 h-12 rounded-full border border-primary flex items-center justify-center hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-surface-tint transition-colors">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">My Rating</label>
              <div className="flex items-center gap-2 h-full">
                <button className="text-surface-variant hover:text-secondary transition-colors"><span className="material-symbols-outlined text-3xl filled">star</span></button>
                <button className="text-surface-variant hover:text-secondary transition-colors"><span className="material-symbols-outlined text-3xl filled">star</span></button>
                <button className="text-surface-variant hover:text-secondary transition-colors"><span className="material-symbols-outlined text-3xl filled">star</span></button>
                <button className="text-surface-variant hover:text-secondary transition-colors"><span className="material-symbols-outlined text-3xl filled">star</span></button>
                <button className="text-surface-variant hover:text-secondary transition-colors"><span className="material-symbols-outlined text-3xl">star</span></button>
                <span className="ml-4 font-body-lg text-body-lg">8 / 10</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-2">Notes</label>
            <div className="w-full min-h-[120px] bg-background border border-outline-variant/20 rounded-lg p-4 font-body-md text-body-md text-on-surface">
              Gear 5 episode was absolute cinema. Need to catch up on the latest manga chapters though.
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button - Contextual */}
      <button className="fixed right-6 bottom-28 md:bottom-8 w-16 h-16 bg-secondary text-on-secondary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50">
        <span className="material-symbols-outlined text-3xl">check</span>
      </button>
    </div>
  );
}

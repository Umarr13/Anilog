import Layout from '../components/Layout.tsx';

export default function Profile() {
  return (
    <Layout activeTab="profile">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="material-symbols-outlined text-6xl text-primary mb-4">construction</span>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Profile Page</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">Coming soon in a future update.</p>
        
        <a 
          href="https://github.com/Umarr13/Anilog/issues/new?title=Bug:&labels=bug" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-error text-on-error rounded-full font-label-lg transition-transform hover:scale-105 active:scale-95"
        >
          <span className="material-symbols-outlined">bug_report</span>
          Report a Bug
        </a>
      </div>
    </Layout>
  );
}

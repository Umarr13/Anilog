import Layout from '../components/Layout.tsx';

export default function Profile() {
  return (
    <Layout activeTab="profile">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-6xl text-primary mb-4">construction</span>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Profile Page</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Coming soon in a future update.</p>
      </div>
    </Layout>
  );
}

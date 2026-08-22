import { useLiveQuery } from 'dexie-react-hooks';
import { db, type AnimeEntry } from '../data/db.ts';
import Layout from '../components/Layout.tsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { useRef } from 'react';
import { useToast } from '../components/Toast';
import ShareCard from '../components/ShareCard';
import ComingSoon from '../components/ComingSoon';

const COLORS = ['#D1C4E9', '#B39DDB', '#9575CD', '#7E57C2', '#673AB7', '#5E35B1', '#512DA8'];

export default function Profile() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const malFileInputRef = useRef<HTMLInputElement>(null);

  const stats = useLiveQuery(async () => {
    const allAnime = await db.anime.toArray();
    let totalEpisodes = 0;
    let totalScore = 0;
    let scoredCount = 0;
    let totalWatchMinutes = 0;
    const genreCounts: Record<string, number> = {};
    const scoreDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const statusCounts = { watching: 0, completed: 0, plan_to_watch: 0, dropped: 0, paused: 0, rewatching: 0 };

    allAnime.forEach(anime => {
      totalEpisodes += anime.currentEpisode;
      // Watch time: episodes watched × avg duration (default 24 min if unknown)
      const dur = anime.avgEpisodeDuration ?? 24;
      totalWatchMinutes += anime.currentEpisode * dur;

      if (anime.score > 0) {
        totalScore += anime.score;
        scoredCount++;
        scoreDist[anime.score] = (scoreDist[anime.score] || 0) + 1;
      }
      anime.genres.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
      const s = anime.status as keyof typeof statusCounts;
      if (s in statusCounts) statusCounts[s]++;
    });

    const averageScore = scoredCount > 0 ? (totalScore / scoredCount).toFixed(1) : '0.0';

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    // Genre DNA for radar (top 6 genres, normalized 0–100)
    const allGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxGenre = allGenres[0]?.[1] ?? 1;
    const genreDna = allGenres.map(([genre, count]) => ({ genre, value: Math.round((count / maxGenre) * 100) }));

    // Score distribution for bar chart
    const scoreDistData = [1, 2, 3, 4, 5].map(s => ({ star: `${s}★`, count: scoreDist[s] ?? 0 }));

    // Watch time formatted
    const watchHours = Math.floor(totalWatchMinutes / 60);
    const watchDays = Math.floor(watchHours / 24);

    return { totalEpisodes, averageScore, topGenres, genreDna, scoreDistData, statusCounts, totalAnime: allAnime.length, watchHours, watchDays, allAnime };
  });

  const handleExport = async () => {
    try {
      const data = await db.anime.toArray();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anilog-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data exported successfully');
    } catch {
      showToast('Failed to export data');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data: AnimeEntry[] = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error('Invalid backup file');
      await db.anime.bulkPut(data);
      showToast('Data imported successfully');
    } catch {
      showToast('Failed to import data');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Feature #11 — MAL XML Import
  const handleMalImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      const animeNodes = xmlDoc.querySelectorAll('anime');

      if (animeNodes.length === 0) throw new Error('No anime found in MAL export');

      const MAL_STATUS_MAP: Record<string, AnimeEntry['status']> = {
        'Completed': 'completed',
        'Watching': 'watching',
        'Plan to Watch': 'plan_to_watch',
        'On-Hold': 'paused',
        'Dropped': 'dropped',
      };

      let imported = 0;
      for (const node of Array.from(animeNodes)) {
        const getText = (tag: string) => node.querySelector(tag)?.textContent?.trim() ?? '';
        const malId = parseInt(getText('series_animedb_id'), 10);
        const title = getText('series_title');
        const eps = parseInt(getText('my_watched_episodes'), 10) || 0;
        const totalEps = parseInt(getText('series_episodes'), 10) || null;
        const malStatus = getText('my_status');
        const score = parseInt(getText('my_score'), 10) || 0;

        if (!malId || !title) continue;

        const status = MAL_STATUS_MAP[malStatus] ?? 'plan_to_watch';

        await db.anime.put({
          id: malId,
          title,
          romajiTitle: title,
          episodes: totalEps,
          currentEpisode: eps,
          status,
          score: Math.min(5, Math.round(score / 2)), // MAL uses 1-10, we use 1-5
          image: '',
          bannerImage: null,
          description: '',
          genres: [],
          year: null,
          studios: [],
          updatedAt: Date.now(),
          avgEpisodeDuration: null,
          rewatchCount: 0,
        });
        imported++;
      }
      showToast(`Imported ${imported} anime from MAL 🎌`);
    } catch (e) {
      showToast('Failed to parse MAL export. Make sure it is a valid XML file.');
      console.error(e);
    }
    if (malFileInputRef.current) malFileInputRef.current.value = '';
  };

  return (
    <Layout activeTab="profile">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-10 pb-24">
        <header className="mb-8">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Your Analytics</h1>
          <p className="font-body-md text-on-surface-variant">Insights into your anime journey.</p>
        </header>

        {/* Top Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="play_circle" label="Episodes Watched" value={stats?.totalEpisodes ?? 0} />
          <StatCard icon="star" label="Avg Score" value={stats?.averageScore ?? '0.0'} />
          <StatCard icon="done_all" label="Completed" value={stats?.statusCounts.completed ?? 0} />
          <StatCard icon="schedule" label="Watching" value={stats?.statusCounts.watching ?? 0} />
        </section>

        {/* Feature #12 — Watch Time Calculator */}
        {(stats?.watchHours ?? 0) > 0 && (
          <ComingSoon version="0.3.0" title="Watch Time Analytics">
            <section className="bg-surface-variant rounded-[24px] p-5 border border-surface flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-primary">timer</span>
              <div>
                <p className="font-headline-md text-on-surface">
                  You've spent <span className="text-primary">{stats!.watchHours.toLocaleString()} hours</span> watching anime
                </p>
                {(stats?.watchDays ?? 0) > 0 && (
                  <p className="font-body-sm text-on-surface-variant mt-0.5">
                    That's {stats!.watchDays} full days of your life — worth every second.
                  </p>
                )}
              </div>
            </section>
          </ComingSoon>
        )}

        {/* Charts Section */}
        {(stats?.totalAnime ?? 0) > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Genre Pie Chart */}
            <div className="bg-surface-variant rounded-[32px] p-6 shadow-sm border border-surface flex flex-col h-80">
              <h3 className="font-title-md text-title-md text-on-surface mb-4">Top Genres</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats?.topGenres} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {stats?.topGenres.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }} itemStyle={{ color: 'var(--color-on-surface)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Library Status */}
            <div className="bg-surface-variant rounded-[32px] p-6 shadow-sm border border-surface flex flex-col h-80">
              <h3 className="font-title-md text-title-md text-on-surface mb-4">Library Status</h3>
              <div className="flex flex-col gap-3 flex-1 justify-center">
                <StatusRow label="Watching" count={stats?.statusCounts.watching ?? 0} total={stats?.totalAnime ?? 0} color="bg-primary" />
                <StatusRow label="Rewatching" count={stats?.statusCounts.rewatching ?? 0} total={stats?.totalAnime ?? 0} color="bg-secondary" />
                <StatusRow label="Completed" count={stats?.statusCounts.completed ?? 0} total={stats?.totalAnime ?? 0} color="bg-tertiary" />
                <StatusRow label="Plan to Watch" count={stats?.statusCounts.plan_to_watch ?? 0} total={stats?.totalAnime ?? 0} color="bg-surface-tint" />
                <StatusRow label="Paused" count={stats?.statusCounts.paused ?? 0} total={stats?.totalAnime ?? 0} color="bg-outline" />
                <StatusRow label="Dropped" count={stats?.statusCounts.dropped ?? 0} total={stats?.totalAnime ?? 0} color="bg-error" />
              </div>
            </div>

            {/* Feature #7 — Score Distribution */}
            <ComingSoon version="0.3.0" title="Score Distribution">
              <div className="bg-surface-variant rounded-[32px] p-6 shadow-sm border border-surface flex flex-col h-64">
                <h3 className="font-title-md text-title-md text-on-surface mb-4">Score Distribution</h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.scoreDistData} barCategoryGap="20%">
                      <XAxis dataKey="star" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'var(--color-surface)' }} cursor={{ fill: 'var(--color-surface-container)' }} />
                      <Bar dataKey="count" fill="var(--color-secondary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ComingSoon>

            {/* Feature #13 — Genre DNA Radar */}
            {(stats?.genreDna?.length ?? 0) >= 3 && (
              <ComingSoon version="0.3.0" title="Genre DNA">
                <div className="bg-surface-variant rounded-[32px] p-6 shadow-sm border border-surface flex flex-col h-64">
                  <h3 className="font-title-md text-title-md text-on-surface mb-4">Genre DNA</h3>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={stats?.genreDna}>
                        <PolarGrid stroke="var(--color-outline-variant)" />
                        <PolarAngleAxis dataKey="genre" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
                        <Radar name="Genres" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.25} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </ComingSoon>
            )}
          </section>
        ) : (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">data_usage</span>
            <p>Add some anime to see your analytics.</p>
          </div>
        )}

        {/* Data Management */}
        <section className="space-y-6">
          <h2 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2">Data Management</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-variant rounded-[24px] p-5 border border-surface flex flex-col gap-3">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">save</span>
                <h3 className="font-title-md text-title-md">Local Backup</h3>
              </div>
              <p className="text-body-sm text-on-surface-variant">Export your data to a JSON file or restore from a previous backup.</p>
              <div className="flex gap-2 mt-auto pt-2">
                <button onClick={handleExport} className="flex-1 py-2 bg-primary text-on-primary rounded-full font-label-md transition-transform hover:scale-105 active:scale-95">Export</button>
                <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-2 bg-surface text-primary border border-primary rounded-full font-label-md transition-transform hover:scale-105 active:scale-95">Import</button>
              </div>
            </div>

            {/* Feature #11 — MAL Import */}
            <ComingSoon version="0.5.0" title="MAL Import">
              <div className="bg-surface-variant rounded-[24px] p-5 border border-surface flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined">upload_file</span>
                  <h3 className="font-title-md text-title-md">MAL Import</h3>
                </div>
                <p className="text-body-sm text-on-surface-variant">Import your MyAnimeList collection from an XML export file. Go to MAL → Profile → Export.</p>
                <input type="file" accept=".xml" ref={malFileInputRef} onChange={handleMalImport} className="hidden" />
                <button
                  onClick={() => malFileInputRef.current?.click()}
                  className="mt-auto py-2 bg-secondary text-on-secondary rounded-full font-label-md flex justify-center items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  Import from MAL
                </button>
              </div>
            </ComingSoon>

            <div className="bg-surface-variant rounded-[24px] p-5 border border-surface flex flex-col gap-3 opacity-70">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">cloud_sync</span>
                <h3 className="font-title-md text-title-md">Google Drive Sync</h3>
              </div>
              <p className="text-body-sm text-on-surface-variant">Bring Your Own Cloud. Sync your database securely to your Drive.</p>
              <button disabled className="mt-auto py-2 bg-surface text-on-surface-variant border border-outline rounded-full font-label-md flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                Coming Soon
              </button>
            </div>
          </div>

          {/* Feature #8 — Share Card */}
          <ComingSoon version="0.4.0" title="Canvas Export">
            <ShareCard allAnime={stats?.allAnime ?? []} />
          </ComingSoon>

          <div className="pt-4 flex justify-center">
            <a
              href="https://github.com/Umarr13/Anilog/issues/new?title=Bug:&labels=bug"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-error/10 text-error rounded-full font-label-lg transition-transform hover:bg-error/20"
            >
              <span className="material-symbols-outlined">bug_report</span>
              Report a Bug
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="bg-surface-variant rounded-[24px] p-4 flex flex-col items-center justify-center text-center gap-2 shadow-sm border border-surface">
      <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
      <div>
        <div className="font-headline-sm text-headline-sm text-on-surface">{value}</div>
        <div className="font-label-sm text-label-sm text-on-surface-variant">{label}</div>
      </div>
    </div>
  );
}

function StatusRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between font-label-md mb-1">
        <span className="text-on-surface">{label}</span>
        <span className="text-on-surface-variant">{count}</span>
      </div>
      <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

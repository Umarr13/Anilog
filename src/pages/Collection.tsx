/**
 * Collection — Phase 3 upgrades:
 * 3.3  Undo toast on removal
 * 3.5  Empty states with contextual CTAs per tab
 * 3.8  Long-press quick actions (ContextMenu)
 * 3.9  Staggered list animation via framer-motion
 */
import { useState } from 'react';
import Layout from '../components/Layout.tsx';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { db, type AnimeEntry } from '../data/db';
import ContextMenu, { type ContextMenuItem } from '../components/ContextMenu';
import { useToast } from '../components/Toast';
import { transitions, variants } from '../hooks/useMotion';

const TAB_LABELS = ['Watched', 'Watching', 'Plan to Watch'] as const;
const STATUSES: AnimeEntry['status'][] = ['completed', 'watching', 'plan_to_watch'];

// 3.5 — Per-tab empty state content
const EMPTY_STATES: Record<string, { icon: string; title: string; message: string }> = {
  completed: {
    icon: 'emoji_events',
    title: 'No completed anime yet',
    message: 'Finish watching a series and it\'ll show up here.',
  },
  watching: {
    icon: 'play_circle',
    title: 'Nothing currently watching',
    message: 'Find something great to start tracking.',
  },
  plan_to_watch: {
    icon: 'bookmark_add',
    title: 'Your watchlist is empty',
    message: 'Browse and save anime you want to watch later.',
  },
};

export default function Collection() {
  const [activeTab, setActiveTab] = useState(0);
  const { showToast } = useToast();

  const filteredAnime = useLiveQuery(
    () => db.anime.where('status').equals(STATUSES[activeTab]).toArray(),
    [activeTab]
  ) || [];

  // 3.3 — Remove with undo
  const handleRemove = async (anime: AnimeEntry) => {
    const snapshot = { ...anime };
    await db.anime.delete(anime.id);
    showToast(`Removed "${anime.title}"`, {
      action: {
        label: 'Undo',
        onClick: () => db.anime.put(snapshot),
      },
    });
  };

  // 3.8 — Quick status change
  const handleStatusChange = async (anime: AnimeEntry, newStatus: AnimeEntry['status']) => {
    await db.anime.update(anime.id, { status: newStatus, updatedAt: Date.now() });
    showToast(`Moved to ${newStatus.replace('_', ' ')}`);
  };

  // 3.8 — Quick episode increment
  const handleNextEpisode = async (anime: AnimeEntry) => {
    const newEp = anime.currentEpisode + 1;
    if (anime.episodes && newEp > anime.episodes) return;
    await db.anime.update(anime.id, { currentEpisode: newEp, updatedAt: Date.now() });
    showToast(`Episode ${newEp}${anime.episodes ? ` / ${anime.episodes}` : ''}`);
  };

  // Build context menu items for each anime card
  const getMenuItems = (anime: AnimeEntry): ContextMenuItem[] => {
    const items: ContextMenuItem[] = [];

    if (anime.status === 'watching') {
      items.push({
        icon: 'skip_next',
        label: 'Mark next episode',
        onClick: () => handleNextEpisode(anime),
      });
    }

    // Status change options (show statuses other than current)
    const otherStatuses = STATUSES.filter((s) => s !== anime.status);
    for (const s of otherStatuses) {
      items.push({
        icon: s === 'completed' ? 'check_circle' : s === 'watching' ? 'play_circle' : 'bookmark',
        label: `Move to ${s.replace('_', ' ')}`,
        onClick: () => handleStatusChange(anime, s),
      });
    }

    items.push({
      icon: 'delete',
      label: 'Remove',
      onClick: () => handleRemove(anime),
      destructive: true,
    });

    return items;
  };

  const currentStatus = STATUSES[activeTab];
  const empty = EMPTY_STATES[currentStatus];

  return (
    <Layout activeTab="collection">
      {/* Header Section */}
      <div className="mb-4 md:mb-8">
        <h2 className="font-headline-xl text-headline-xl text-primary mb-2">My Collection</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Track your anime journey.</p>
      </div>

      {/* Tabs Island */}
      <div className="bg-surface-container-lowest rounded-xl p-2 flex relative floating-island mb-8 overflow-x-auto no-scrollbar">
        {TAB_LABELS.map((label, i) => (
          <button
            key={label}
            className={`flex-1 py-3 px-6 text-center rounded-lg font-label-md text-label-md transition-colors relative z-10 whitespace-nowrap ${activeTab === i ? 'text-primary bg-surface-container-low' : 'text-on-surface-variant hover:bg-surface-container/50'}`}
            onClick={() => setActiveTab(i)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Collection List — 3.9 staggered animation */}
      <motion.div
        className="space-y-4"
        variants={variants.staggerContainer}
        initial="initial"
        animate="animate"
        key={activeTab}
      >
        {filteredAnime.length === 0 ? (
          /* 3.5 — Contextual empty state */
          <motion.div
            className="flex flex-col items-center text-center py-16"
            variants={variants.fadeSlideUp}
            initial="initial"
            animate="animate"
            transition={transitions.default}
          >
            <span className="material-symbols-outlined text-6xl text-secondary mb-4">{empty.icon}</span>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-2">{empty.title}</h3>
            <p className="text-on-surface-variant font-body-md text-body-md mb-6 max-w-xs">{empty.message}</p>
            <Link
              to="/search"
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md hover:opacity-90 transition-opacity active:scale-95 inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              Search for anime
            </Link>
          </motion.div>
        ) : (
          filteredAnime.map((anime) => (
            <motion.div key={anime.id} variants={variants.staggerChild} transition={transitions.default}>
              {/* 3.8 — Context menu wrapper */}
              <ContextMenu items={getMenuItems(anime)}>
                <Link
                  to={`/anime/${anime.id}`}
                  className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 floating-island hover:scale-[1.01] transition-transform cursor-pointer block"
                >
                  <img
                    className="w-16 h-16 rounded-lg object-cover bg-surface-container-low border border-surface-variant"
                    src={anime.image}
                    alt={`${anime.title} Thumbnail`}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-label-md text-label-md text-primary truncate">{anime.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm truncate">
                      {anime.episodes ? `${anime.episodes} Episodes` : 'Ongoing'} • {anime.genres.join(', ')}
                    </p>
                    {anime.status === 'watching' && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="h-1.5 flex-1 max-w-[120px] bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary rounded-full transition-all duration-500"
                            style={{ width: `${anime.episodes ? (anime.currentEpisode / anime.episodes) * 100 : 50}%` }}
                          />
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {anime.currentEpisode}/{anime.episodes || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right pl-4 border-l border-surface-variant">
                    <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary block">{anime.score ? Math.round(anime.score * 10) / 10 : '-'}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">/10</span>
                  </div>
                </Link>
              </ContextMenu>
            </motion.div>
          ))
        )}
      </motion.div>

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

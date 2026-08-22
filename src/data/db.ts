import Dexie, { type EntityTable } from 'dexie';

export interface AnimeEntry {
  id: number; // AniList ID
  title: string;
  romajiTitle: string;
  episodes: number | null;
  currentEpisode: number;
  status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'paused' | 'rewatching';
  score: number;
  image: string;
  bannerImage: string | null;
  description: string;
  genres: string[];
  year: number | null;
  studios: string[];
  updatedAt: number;
  /** Average episode duration in minutes (from AniList). Used for watch-time calc. */
  avgEpisodeDuration: number | null;
  /** How many times the user has rewatched this title. */
  rewatchCount: number;
}

export interface ReportEntry {
  id?: number;
  comment: string;
  screenshotBase64: string;
  context: any;
  status: 'pending' | 'submitted' | 'failed';
  createdAt: number;
}

const db = new Dexie('AnilogDB') as Dexie & {
  anime: EntityTable<AnimeEntry, 'id'>;
  reports: EntityTable<ReportEntry, 'id'>;
};

// Schema declaration
db.version(1).stores({
  anime: 'id, status, updatedAt'
});

db.version(2).stores({
  anime: 'id, status, updatedAt',
  reports: '++id, status, createdAt'
});

// Version 3 — adds rewatching status, rewatchCount, avgEpisodeDuration
// Dexie handles new optional fields transparently; only index changes need a new version.
db.version(3).stores({
  anime: 'id, status, updatedAt',
  reports: '++id, status, createdAt'
}).upgrade(tx => {
  // Migrate existing entries: set default values for new fields
  return tx.table('anime').toCollection().modify(entry => {
    if (entry.rewatchCount === undefined) entry.rewatchCount = 0;
    if (entry.avgEpisodeDuration === undefined) entry.avgEpisodeDuration = null;
  });
});

export type { Dexie };
export { db };

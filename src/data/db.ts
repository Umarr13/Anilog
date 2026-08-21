import Dexie, { type EntityTable } from 'dexie';

export interface AnimeEntry {
  id: number; // AniList ID
  title: string;
  romajiTitle: string;
  episodes: number | null;
  currentEpisode: number;
  status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'paused';
  score: number;
  image: string;
  bannerImage: string | null;
  description: string;
  genres: string[];
  year: number | null;
  studios: string[];
  updatedAt: number;
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

export type { Dexie };
export { db };

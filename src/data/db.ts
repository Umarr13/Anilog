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

const db = new Dexie('AnilogDB') as Dexie & {
  anime: EntityTable<
    AnimeEntry,
    'id' // primary key 'id'
  >;
};

// Schema declaration
db.version(1).stores({
  anime: 'id, status, updatedAt' // Primary key and indexed props
});

export type { Dexie };
export { db };

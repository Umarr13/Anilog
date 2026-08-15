/**
 * Phase 7 — Lightweight API response cache using sessionStorage.
 * Each cached entry has a TTL (time-to-live) in milliseconds.
 * On cache hit the network request is skipped entirely → instant render.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE_PREFIX = 'anilog_api_';

/** Read a cached value. Returns `null` if missing or expired. */
function get<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

/** Store a value with a TTL (in ms). */
function set<T>(key: string, data: T, ttlMs: number): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      expiresAt: Date.now() + ttlMs,
    };
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // sessionStorage full or unavailable — fail silently
  }
}

/** TTL presets (in ms) */
export const TTL = {
  SEARCH:    5 * 60 * 1000,   // 5 minutes
  TRENDING: 30 * 60 * 1000,   // 30 minutes
  DETAILS:  60 * 60 * 1000,   // 1 hour
  CALENDAR: 15 * 60 * 1000,   // 15 minutes
} as const;

export const apiCache = { get, set };

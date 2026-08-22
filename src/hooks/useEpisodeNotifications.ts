/**
 * useEpisodeNotifications — Feature #3
 * Checks the user's "watching" collection for shows that have a nextAiringEpisode
 * scheduled for today and schedules a local notification for each one.
 *
 * Runs once per session (gated by sessionStorage flag).
 * Gracefully degrades: no-op if LocalNotifications aren't available (web/browser preview).
 */
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { db } from '../data/db';
import { getAnimeDetails } from '../api/anilist';

const SESSION_KEY = 'anilog_notifications_scheduled';

export function useEpisodeNotifications() {
  useEffect(() => {
    // Only run once per session and only on native (Android/iOS)
    if (sessionStorage.getItem(SESSION_KEY) === 'true') return;
    if (!Capacitor.isNativePlatform()) return;

    scheduleAiringNotifications();
    sessionStorage.setItem(SESSION_KEY, 'true');
  }, []);
}

async function scheduleAiringNotifications() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let LocalNotifications: any;
    try {
      // Dynamic import — gracefully fails if package isn't installed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod: any = await import('@capacitor/local-notifications' as string);
      LocalNotifications = mod.LocalNotifications;
    } catch {
      return; // Package not available — silent no-op
    }

    const permissions = await LocalNotifications.requestPermissions();
    if (permissions.display !== 'granted') return;

    // Fetch user's currently-watching collection
    const watchingAnime = await db.anime
      .where('status')
      .anyOf(['watching', 'rewatching'])
      .toArray();

    if (watchingAnime.length === 0) return;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayStartTs = todayStart.getTime() / 1000;
    const todayEndTs = todayEnd.getTime() / 1000;

    const notifications: unknown[] = [];

    for (const entry of watchingAnime) {
      try {
        const anilistData = await getAnimeDetails(entry.id);
        const airing = anilistData.nextAiringEpisode;

        if (!airing) continue;

        if (airing.airingAt >= todayStartTs && airing.airingAt <= todayEndTs) {
          const airDate = new Date(airing.airingAt * 1000);

          notifications.push({
            id: entry.id,
            title: `🎌 New Episode — ${entry.title}`,
            body: `Episode ${airing.episode} is out now! Time to watch.`,
            schedule: { at: airDate, allowWhileIdle: true },
            smallIcon: 'ic_stat_luffy',
            channelId: 'episode_alerts',
          });
        }
      } catch {
        // continue with next entry
      }
    }

    if (notifications.length === 0) return;

    await LocalNotifications.createChannel({
      id: 'episode_alerts',
      name: 'Episode Alerts',
      description: 'Notifies you when a new episode of an airing show is available',
      importance: 3,
      visibility: 1,
    });

    await LocalNotifications.schedule({ notifications });
  } catch {
    // Fully silent — never crash the app over notifications
  }
}


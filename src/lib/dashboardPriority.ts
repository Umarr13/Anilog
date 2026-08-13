import type { AnimeEntry } from '../data/db';
import quotes from '../data/quotes.json';

export type PriorityCardType =
  | 'finish_soon'
  | 'new_episode'
  | 'resume_watching'
  | 'plan_to_watch'
  | 'quote'
  | 'empty';

export interface PriorityCardState {
  type: PriorityCardType;
  anime?: AnimeEntry;
  quote?: { quote: string; character: string; anime: string; tags: string[] };
  message: string;
}

/**
 * 6.15 Adaptive Dashboard Scoring & 6.16 Behavioral Time-Pattern Awareness
 * Evaluates candidate states against local Dexie data and current time.
 */
export function getDashboardPriorityCard(
  allAnime: AnimeEntry[]
): PriorityCardState {
  if (allAnime.length === 0) {
    return {
      type: 'empty',
      message: "You haven't added anything in a while. Search for a new anime!",
    };
  }

  const watching = allAnime.filter((a) => a.status === 'watching');
  const planToWatch = allAnime.filter((a) => a.status === 'plan_to_watch');

  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = currentDay === 0 || currentDay === 6;
  const isEvening = currentHour >= 18 || currentHour < 2;

  // Simple historical pattern heuristic: Assuming user watches most during weekend evenings
  // In a real app, this would query the `journal` table for actual watch timestamps.
  const isHighActivityWindow = isWeekend && isEvening;
  const isLowActivityWindow = !isWeekend && currentHour >= 9 && currentHour < 17; // Work hours

  // 1. Close to completion (e.g. within 2 episodes of finishing)
  const closeToFinish = watching.find(
    (a) => a.episodes && a.episodes - a.currentEpisode <= 2 && a.episodes - a.currentEpisode > 0
  );

  if (closeToFinish && !isLowActivityWindow) {
    return {
      type: 'finish_soon',
      anime: closeToFinish,
      message: `Finish ${closeToFinish.title}? ${closeToFinish.episodes! - closeToFinish.currentEpisode} episodes left.`,
    };
  }

  // 2. Currently-airing show with a new episode available
  // Fake heuristic since we don't store airing schedules locally yet
  const newlyUpdated = watching.find(
    (a) => now.getTime() - a.updatedAt < 1000 * 60 * 60 * 24 // Updated within last 24h
  );
  
  if (newlyUpdated && isHighActivityWindow) {
    return {
      type: 'new_episode',
      anime: newlyUpdated,
      message: `You recently watched ${newlyUpdated.title}. Resume?`,
    };
  }

  // 3. Untouched for 2+ weeks but still marked Watching
  const untouchedTwoWeeks = watching.find(
    (a) => now.getTime() - a.updatedAt > 1000 * 60 * 60 * 24 * 14
  );

  if (untouchedTwoWeeks && !isLowActivityWindow) {
    return {
      type: 'resume_watching',
      anime: untouchedTwoWeeks,
      message: `It's been a while! Pick ${untouchedTwoWeeks.title} back up?`,
    };
  }

  // 4. Fallbacks: Quote or Plan to Watch
  if (isLowActivityWindow || watching.length === 0) {
    // If it's a low activity window (e.g. Tuesday afternoon), show a lighter quote card
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return {
      type: 'quote',
      quote: randomQuote,
      message: `"${randomQuote.quote}" — ${randomQuote.character}`,
      // Optionally link to the anime if it exists in the user's DB
      anime: allAnime.find((a) => a.title === randomQuote.anime || a.romajiTitle === randomQuote.anime)
    };
  }

  if (planToWatch.length > 0) {
    const randomPTW = planToWatch[Math.floor(Math.random() * planToWatch.length)];
    return {
      type: 'plan_to_watch',
      anime: randomPTW,
      message: `Looking for something new? Start ${randomPTW.title}.`,
    };
  }

  // Absolute fallback
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return {
    type: 'quote',
    quote: randomQuote,
    message: `"${randomQuote.quote}" — ${randomQuote.character}`,
  };
}

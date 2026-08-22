import { apiCache, TTL } from '../lib/apiCache';

export const ANILIST_API_URL = 'https://graphql.anilist.co';

export interface AniListAiringSchedule {
  airingAt: number; // Unix timestamp
  episode: number;
}

export interface AniListAnime {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    extraLarge: string;
    large: string;
  };
  bannerImage: string | null;
  description: string;
  episodes: number | null;
  duration: number | null; // avg minutes per episode
  status: string;
  genres: string[];
  averageScore: number;
  seasonYear: number | null;
  studios: {
    nodes: { name: string }[];
  };
  nextAiringEpisode: AniListAiringSchedule | null;
  trailer?: {
    id: string;
    site: string;
    thumbnail: string;
  } | null;
  relations?: {
    edges: {
      relationType: string;
      node: {
        id: number;
        title: { english: string; romaji: string };
        coverImage: { large: string };
        type: string;
      }
    }[];
  };
}

// Shared media fields fragment (string literal, inlined into each query)
const MEDIA_FIELDS = `
  id
  title { romaji english native }
  coverImage { extraLarge large }
  bannerImage
  description(asHtml: false)
  episodes
  duration
  status
  genres
  averageScore
  seasonYear
  studios(isMain: true) { nodes { name } }
  nextAiringEpisode { airingAt episode }
  trailer { id site thumbnail }
  relations {
    edges {
      relationType
      node { id title { english romaji } coverImage { large } type }
    }
  }
`;

const searchQuery = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { total currentPage lastPage hasNextPage perPage }
    media(search: $search, type: ANIME, sort: POPULARITY_DESC) { ${MEDIA_FIELDS} }
  }
}
`;

const getByIdQuery = `
query ($id: Int) {
  Media(id: $id, type: ANIME) { ${MEDIA_FIELDS} }
}
`;

const trendingQuery = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: TRENDING_DESC) { ${MEDIA_FIELDS} }
  }
}
`;

const topRatedQuery = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: SCORE_DESC, minimumTagRank: 60) { ${MEDIA_FIELDS} }
  }
}
`;

// "Hidden Gems" = highly scored but low popularity
const hiddenGemsQuery = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: SCORE_DESC, averageScore_greater: 79, popularity_lesser: 50000, episodes_greater: 1) { ${MEDIA_FIELDS} }
  }
}
`;

async function fetchAniList<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data;
}

export async function searchAnime(query: string, page = 1, perPage = 12): Promise<AniListAnime[]> {
  const cacheKey = `search_${query}_${page}_${perPage}`;
  const cached = apiCache.get<AniListAnime[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchAniList<{ Page: { media: AniListAnime[] } }>(searchQuery, { search: query, page, perPage });
  const results = data.Page.media;
  apiCache.set(cacheKey, results, TTL.SEARCH);
  return results;
}

export async function getTrendingAnime(page = 1, perPage = 12): Promise<AniListAnime[]> {
  const cacheKey = `trending_${page}_${perPage}`;
  const cached = apiCache.get<AniListAnime[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchAniList<{ Page: { media: AniListAnime[] } }>(trendingQuery, { page, perPage });
  const results = data.Page.media;
  apiCache.set(cacheKey, results, TTL.TRENDING);
  return results;
}

export async function getTopRatedAnime(page = 1, perPage = 12): Promise<AniListAnime[]> {
  const cacheKey = `top_rated_${page}_${perPage}`;
  const cached = apiCache.get<AniListAnime[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchAniList<{ Page: { media: AniListAnime[] } }>(topRatedQuery, { page, perPage });
  const results = data.Page.media;
  apiCache.set(cacheKey, results, TTL.TRENDING);
  return results;
}

export async function getHiddenGems(page = 1, perPage = 12): Promise<AniListAnime[]> {
  const cacheKey = `hidden_gems_${page}_${perPage}`;
  const cached = apiCache.get<AniListAnime[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchAniList<{ Page: { media: AniListAnime[] } }>(hiddenGemsQuery, { page, perPage });
  const results = data.Page.media;
  apiCache.set(cacheKey, results, TTL.TRENDING);
  return results;
}

export async function getAnimeDetails(id: number): Promise<AniListAnime> {
  const cacheKey = `details_${id}`;
  const cached = apiCache.get<AniListAnime>(cacheKey);
  if (cached) return cached;

  const data = await fetchAniList<{ Media: AniListAnime }>(getByIdQuery, { id });
  const result = data.Media;
  apiCache.set(cacheKey, result, TTL.DETAILS);
  return result;
}


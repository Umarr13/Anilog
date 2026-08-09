export const ANILIST_API_URL = 'https://graphql.anilist.co';

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
  status: string;
  genres: string[];
  averageScore: number;
  seasonYear: number | null;
  studios: {
    nodes: { name: string }[];
  };
}

const searchQuery = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
      }
      bannerImage
      description(asHtml: false)
      episodes
      status
      genres
      averageScore
      seasonYear
      studios(isMain: true) {
        nodes {
          name
        }
      }
    }
  }
}
`;

const getByIdQuery = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
    }
    bannerImage
    description(asHtml: false)
    episodes
    status
    genres
    averageScore
    seasonYear
    studios(isMain: true) {
      nodes {
        name
      }
    }
  }
}
`;

const trendingQuery = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: TRENDING_DESC) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
      }
      bannerImage
      description(asHtml: false)
      episodes
      status
      genres
      averageScore
      seasonYear
      studios(isMain: true) {
        nodes {
          name
        }
      }
    }
  }
}
`;

export async function searchAnime(query: string, page = 1, perPage = 12): Promise<AniListAnime[]> {
  const variables = {
    search: query,
    page,
    perPage
  };

  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: searchQuery,
      variables
    })
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  
  return data.data.Page.media;
}

export async function getTrendingAnime(page = 1, perPage = 12): Promise<AniListAnime[]> {
  const variables = {
    page,
    perPage
  };

  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: trendingQuery,
      variables
    })
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  
  return data.data.Page.media;
}

export async function getAnimeDetails(id: number): Promise<AniListAnime> {
  const variables = { id };

  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: getByIdQuery,
      variables
    })
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  
  return data.data.Media;
}

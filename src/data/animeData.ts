export interface Anime {
  id: string;
  title: string;
  romajiTitle: string;
  episodes: number;
  currentEpisode: number;
  status: 'watching' | 'completed' | 'plan_to_watch';
  score?: number;
  image: string;
  bannerImage: string;
  description: string;
  genres: string[];
  year: number;
  studios: string[];
}

export const animeData: Anime[] = [
  {
    id: 'one-piece',
    title: 'One Piece',
    romajiTitle: 'One Piece',
    episodes: 1100, // ongoing
    currentEpisode: 1093,
    status: 'watching',
    score: 9.5,
    image: '/luffy_icon.png',
    bannerImage: '/luffy_icon.png', // using same image as placeholder
    description: 'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.',
    genres: ['Action', 'Adventure', 'Fantasy'],
    year: 1999,
    studios: ['Toei Animation'],
  },
  {
    id: 'jujutsu-kaisen-2',
    title: 'Jujutsu Kaisen Season 2',
    romajiTitle: 'Jujutsu Kaisen 2nd Season',
    episodes: 23,
    currentEpisode: 23,
    status: 'completed',
    score: 9.0,
    image: '/luffy_icon.png', // using same image as placeholder for now
    bannerImage: '/luffy_icon.png',
    description: 'Second season of Jujutsu Kaisen.',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    year: 2023,
    studios: ['MAPPA'],
  },
  {
    id: 'frieren',
    title: 'Frieren: Beyond Journey\'s End',
    romajiTitle: 'Sousou no Frieren',
    episodes: 28,
    currentEpisode: 0,
    status: 'plan_to_watch',
    image: '/luffy_icon.png',
    bannerImage: '/luffy_icon.png',
    description: 'The demon king has been defeated, and the victorious hero party returns home before disbanding. The four—mage Frieren, hero Himmel, priest Heiter, and warrior Eisen—reminisce about their decade-long journey as the moment to bid each other farewell arrives.',
    genres: ['Adventure', 'Drama', 'Fantasy'],
    year: 2023,
    studios: ['Madhouse'],
  }
];

export const getAnimeById = (id: string | undefined): Anime | undefined => {
  if (!id) return undefined;
  return animeData.find(a => a.id === id);
};

export const getAnimeByStatus = (status: Anime['status']): Anime[] => {
  return animeData.filter(a => a.status === status);
};

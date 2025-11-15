export type SongStats = {
  views: number;
  likes: number;
  ranking: number;
};

export type SongSource = {
  platform: "youtube" | "soundcloud" | "deezer" | "audiomack";
  url: string;
};

export type Song = {
  id: string;
  slug: string;
  title: string;
  artist: { id: string; slug: string; name: string; avatarUrl?: string };
  audioUrl: string;
  coverUrl?: string;
  sources?: SongSource[];
  stats: { views: number; likes: number; ranking: number };
  hasLyrics?: boolean;
  releasedAt?: string;
  durationSec?: number;
};

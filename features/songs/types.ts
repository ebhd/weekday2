// features/songs/types.ts
export type SongStats = {
  views: number;
  likes: number;
  ranking?: number;
};

export type SongSource = {
  platform: "youtube" | "soundcloud" | "deezer" | "audiomack";
  url: string;
};

export type SongArtistPreview = {
  id: string;
  slug: string;
  name: string;
  avatarUrl?: string;
};

export type Song = {
  id: string;
  slug: string;
  title: string;
  artist: SongArtistPreview;
  audioUrl: string;
  coverUrl?: string;
  sources?: SongSource[];
  stats: SongStats;
  hasLyrics?: boolean;
  isDownloadable: boolean;
  releasedAt?: string;
  durationSec?: number;
};

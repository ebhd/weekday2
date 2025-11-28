// features/artists/types.ts
export type ArtistProfile = {
  bannerUrl?: string;
  avatarUrl?: string;
  bio?: string;
  socials?: Record<string, string>;
};

export type ArtistStats = {
  totalViews: number;
  totalLikes: number;
  ranking: number;
  totalSongs: number;
  memberSince: string;
};

export type Artist = {
  id: string;
  slug: string;
  name: string; 
  profile: ArtistProfile;
  stats: ArtistStats;
};

export type ArtistCardProps = {
  rank: number;
  name: string;
  imagePath: string;
  views: number;
  hearts: number;
  link: string;
};

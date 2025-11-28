// features/ranking/types.ts
export type RankingRowProps = {
  rank: number;

  songId: string;
  songSlug: string;
  artistId: string;
  artistSlug: string;

  songTitle: string;
  audioUrl: string;
  artistName: string;
  artistImageUrl?: string;

  views: number;
  hearts: number;
  isHearted: boolean;

  link: string;
};

export type RankingStats = {
  views: number;
  hearts: number;
  isHearted: boolean;
};

export type ArtistRankingRow = {
  rank: number;
  artistId: string;
  artistSlug: string;
  artistName: string;
  artistImageUrl?: string;

  totalViews: number;
  totalHearts: number;

  link: string;
};

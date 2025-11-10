export type RankingRowProps = {
  rank: number;
  artistsName: string;
  artistsImagePath?: string;
  songName: string;
  songPath: string;
  views: number;
  hearts: number;
  isHearted: boolean;
};

export type RankingStats = {
  views: number;
  hearts: number;
  isHearted: boolean;
};

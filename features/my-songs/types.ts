// features/my-songs/types.ts
export type SongStatus = "pending" | "approved" | "rejected" | "deleted";

export type MySongRow = {
  id: string;
  title: string;
  slug: string;
  audioUrl: string;
  durationSec: number | null;
  releasedAt: string | null;
  status: SongStatus;
  createdAt: string;
  approvedAt: string | null;
  isDownloadable: boolean;
};

export type MySongUpdateInput = {
  title: string;
  slug: string;
  isDownloadable: boolean;
};

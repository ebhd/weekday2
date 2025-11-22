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
};

export type MySongUpdateInput = {
  title: string;
  slug: string;
};

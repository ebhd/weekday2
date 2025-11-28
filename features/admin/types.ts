// features/admin/types.ts
import type { UserRole } from "@/features/auth/types";
export type AdminArtistStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "disabled";

export type AdminStats = {
  totalAccounts: number;
  totalAdmins: number;
  totalArtists: number;
  totalVisitors: number;
};

export type AdminUserRow = {
  id: string;
  email: string;
  username: string | null;
  role: UserRole;
  created_at: string;
};

export type AdminArtistRow = {
  id: string;
  slug: string;
  display_name: string;
  status: AdminArtistStatus;
  created_at: string;
  user_email: string | null;
};

export type AdminSongRow = {
  id: string;
  slug: string;
  title: string;
  status: "pending" | "approved" | "rejected" | "disabled";
  play_count: number;
  like_count: number;
  score: number;
  created_at: string;
  artist_name: string | null;
  is_downloadable: boolean;
};

export type AdminTeamRow = {
  id: string;
  email: string;
  username: string | null;
  role: Extract<UserRole, "admin_full" | "admin_reviewer">;
  created_at: string;
};

export type AdminCandidateRow = {
  id: string;
  email: string;
  username: string | null;
  role: Extract<UserRole, "user" | "artist">;
  created_at: string;
};

export type AdminSubmitSongRow = {
  id: string;
  slug: string;
  title: string;
  audioUrl: string;
  durationSec: number | null;
  createdAt: string;
  artistName: string | null;
  status: "pending" | "approved" | "rejected" | "deleted";
};

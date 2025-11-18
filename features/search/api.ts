import { supabase } from "@/lib/supabaseClient";
import type { DatasetItem } from "./types";
import { zSearchSongRow } from "./schemas";

export async function getLocalDataset(): Promise<DatasetItem[]> {
  const { data, error } = await supabase
    .from("songs")
    .select(
      `
      id,
      slug,
      title,
      play_count,
      like_count,
      score,
      artists:artist_id (
        id,
        slug,
        display_name
      )
    `
    )
    .eq("status", "approved")
    .order("score", { ascending: false });

  if (error) {
    console.error("getLocalDataset (search) error", error);
    return [];
  }

  const rows = (data ?? []).map((raw) => zSearchSongRow.parse(raw));

  return rows.map<DatasetItem>((row, index) => ({
    rank: index + 1,

    artistId: row.artists.id,
    artistSlug: row.artists.slug,
    artistName: row.artists.display_name,

    songId: row.id,
    songSlug: row.slug,
    songTitle: row.title,

    views: row.play_count ?? 0,
    hearts: row.like_count ?? 0,
  }));
}

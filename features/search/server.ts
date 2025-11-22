import "server-only";
import { cache } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { DatasetItem } from "./types";
import { zSearchSongRow } from "./schemas";

export const getLocalDataset = cache(
  async ({ limit = 1000 }: { limit?: number } = {}): Promise<DatasetItem[]> => {
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
      .order("score", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("getLocalDataset (search) error", error);
      return [];
    }

    const rows = (data ?? []).flatMap((raw) => {
      const parsed = zSearchSongRow.safeParse(raw);
      return parsed.success ? [parsed.data] : [];
    });

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
);

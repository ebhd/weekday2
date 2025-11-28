import "server-only";
import { supabase } from "@/lib/supabaseClient";
import type { AdminSongRow } from "@/features/admin/types";

export async function getAdminSongs(): Promise<AdminSongRow[]> {
  const { data, error } = await supabase
    .from("songs")
    .select(
      `
      id,
      slug,
      title,
      status,
      play_count,
      like_count,
      score,
      created_at,
      is_downloadable,
      artists:artist_id ( display_name )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminSongs error", error);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    play_count: row.play_count ?? 0,
    like_count: row.like_count ?? 0,
    score: row.score ?? 0,
    created_at: row.created_at,
    artist_name: row.artists?.display_name ?? null,
    is_downloadable: !!row.is_downloadable,
  })) as AdminSongRow[];
}

import "server-only";
import { supabase } from "@/lib/supabaseClient";
import type { AdminSubmitSongRow } from "../types";

export async function getPendingSongs(
  limit = 200
): Promise<AdminSubmitSongRow[]> {
  const { data, error } = await supabase
    .from("songs")
    .select(
      `
      id,
      slug,
      title,
      audio_url,
      duration_sec,
      status,
      created_at,
      artists:artist_id (
        display_name
      )
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getPendingSongs error", error);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    audioUrl: row.audio_url,
    durationSec: row.duration_sec ?? null,
    status: row.status,
    createdAt: row.created_at,
    artistName: row.artists?.display_name ?? null,
  })) as AdminSubmitSongRow[];
}

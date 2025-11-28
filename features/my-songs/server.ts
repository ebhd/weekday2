// features/my-songs/server.ts
import "server-only";

import { supabase } from "@/lib/supabaseClient";
import type { MySongRow, MySongUpdateInput } from "./types";
import { STORAGE_BUCKET } from "@/features/storage/shared";

function extractStoragePath(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

export async function getArtistIdForUser(
  userId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("artists")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "approved")
    .maybeSingle();

  if (error || !data) return null;
  return data.id as string;
}

export async function getMySongs(artistId: string): Promise<MySongRow[]> {
  const { data, error } = await supabase
    .from("songs")
    .select(
      "id, title, slug, audio_url, duration_sec, released_at, status, created_at, approved_at, is_downloadable"
    )
    .eq("artist_id", artistId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getMySongs error", error);
    return [];
  }

  return (data ?? []).map((s: any) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    audioUrl: s.audio_url,
    durationSec: s.duration_sec,
    releasedAt: s.released_at,
    status: s.status,
    createdAt: s.created_at,
    approvedAt: s.approved_at,
    isDownloadable: s.is_downloadable ?? true,
  }));
}

export async function updateMySong(
  artistId: string,
  songId: string,
  input: MySongUpdateInput
): Promise<MySongRow | null> {
  const { data, error } = await supabase
    .from("songs")
    .update({
      title: input.title.trim(),
      slug: input.slug.trim(),
      is_downloadable: input.isDownloadable,
    })
    .eq("id", songId)
    .eq("artist_id", artistId)
    .select(
      "id, title, slug, audio_url, duration_sec, released_at, status, created_at, approved_at, is_downloadable"
    )
    .maybeSingle();

  if (error || !data) {
    console.error("updateMySong error", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    audioUrl: data.audio_url,
    durationSec: data.duration_sec,
    releasedAt: data.released_at,
    status: data.status,
    createdAt: data.created_at,
    approvedAt: data.approved_at,
    isDownloadable: data.is_downloadable ?? true,
  };
}

export async function deleteMySong(
  artistId: string,
  songId: string
): Promise<
  { success: true } | { success: false; reason: "NOT_FOUND" | "DB_FAIL" }
> {
  const { data: song, error: loadErr } = await supabase
    .from("songs")
    .select("id, audio_url, status")
    .eq("id", songId)
    .eq("artist_id", artistId)
    .maybeSingle();

  if (loadErr || !song) return { success: false, reason: "NOT_FOUND" };
  if (song.status === "deleted") return { success: true };

  const storagePath = extractStoragePath(song.audio_url);
  if (storagePath) {
    const { error: rmErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (rmErr) console.warn("storage remove failed", rmErr);
  }

  const { error: delErr } = await supabase
    .from("songs")
    .update({
      status: "deleted",
    })
    .eq("id", songId)
    .eq("artist_id", artistId);

  if (delErr) {
    console.error("song soft delete failed", delErr);
    return { success: false, reason: "DB_FAIL" };
  }

  return { success: true };
}

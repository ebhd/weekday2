// features/songs/server.ts
import "server-only";

import { supabase } from "@/lib/supabaseClient";
import type { Song, SongArtistPreview } from "./types";
import { zSongRowWithArtist, type SongRowWithArtist } from "./schemas";
import { computeSongScore } from "@/features/ranking/utils";

const SELECT_WITH_ARTIST = `
  id,
  artist_id,
  title,
  slug,
  audio_url,
  cover_url,
  duration_sec,
  has_lyrics,
  released_at,
  play_count,
  like_count,
  dislike_count,
  score,
  artists:artist_id (
    id,
    slug,
    display_name,
    avatar_url
  )
`;

function mapSong(row: SongRowWithArtist, ranking?: number): Song {
  const artist: SongArtistPreview = {
    id: row.artists.id,
    slug: row.artists.slug,
    name: row.artists.display_name,
    avatarUrl: row.artists.avatar_url ?? undefined,
  };

  const views = row.play_count ?? 0;
  const likes = row.like_count ?? 0;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    artist,
    audioUrl: row.audio_url,
    coverUrl: row.cover_url ?? undefined,
    stats: {
      views,
      likes,
      ranking,
    },
    hasLyrics: row.has_lyrics ?? undefined,
    releasedAt: row.released_at ?? undefined,
    durationSec: row.duration_sec ?? undefined,
  };
}

async function getSongRowBy(
  field: "slug" | "id",
  value: string
): Promise<SongRowWithArtist | null> {
  const { data, error } = await supabase
    .from("songs")
    .select(SELECT_WITH_ARTIST)
    .eq(field, value)
    .eq("status", "approved")
    .maybeSingle();

  if (error) {
    console.error("getSongRowBy error", error);
    return null;
  }
  if (!data) return null;

  const parsed = zSongRowWithArtist.safeParse(data);
  if (!parsed.success) {
    console.error("zSongRowWithArtist parse error", parsed.error);
    return null;
  }

  return parsed.data;
}

async function computeSongRankingForScore(score: number): Promise<number> {
  const { count, error } = await supabase
    .from("songs")
    .select("id", { head: true, count: "exact" })
    .eq("status", "approved")
    .gt("score", score);

  if (error) {
    console.error("computeSongRankingForScore error", error);
    return 0;
  }
  return (count ?? 0) + 1;
}

export async function getSongBySlug(slug: string): Promise<Song | null> {
  const row = await getSongRowBy("slug", slug);
  if (!row) return null;

  const score = row.score ?? computeSongScore(mapSong(row));
  const ranking = await computeSongRankingForScore(score);
  return mapSong(row, ranking);
}

export async function getSongById(id: string): Promise<Song | null> {
  const row = await getSongRowBy("id", id);
  if (!row) return null;

  const score = row.score ?? computeSongScore(mapSong(row));
  const ranking = await computeSongRankingForScore(score);
  return mapSong(row, ranking);
}

export async function getSongsByArtistId(
  artistId: string,
  { limit = 50, offset = 0 } = {}
): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select(SELECT_WITH_ARTIST)
    .eq("artist_id", artistId)
    .eq("status", "approved")
    .order("released_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("getSongsByArtistId error", error);
    return [];
  }

  const rows = (data ?? [])
    .map((raw) => zSongRowWithArtist.safeParse(raw))
    .filter((r): r is { success: true; data: SongRowWithArtist } => r.success)
    .map((r) => r.data);

  return rows.map((row) => mapSong(row));
}

export async function getSongWithArtistPreview(slug: string): Promise<{
  song: Song;
  artist: SongArtistPreview;
} | null> {
  const row = await getSongRowBy("slug", slug);
  if (!row) return null;

  const score = row.score ?? computeSongScore(mapSong(row));
  const ranking = await computeSongRankingForScore(score);
  const song = mapSong(row, ranking);

  return { song, artist: song.artist };
}

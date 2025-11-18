import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import type { Song } from "./types";
import { zSongRowWithArtist, type SongRowWithArtist } from "./schemas";

const zSongRowBase = zSongRowWithArtist.omit({ artists: true });

type SongRowBase = z.infer<typeof zSongRowBase>;

function mapSong(row: SongRowWithArtist, ranking?: number): Song {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    artist: {
      id: row.artists.id,
      slug: row.artists.slug,
      name: row.artists.display_name,
      avatarUrl: row.artists.avatar_url ?? undefined,
    },
    audioUrl: row.audio_url,
    coverUrl: row.cover_url ?? undefined,
    stats: {
      views: row.play_count,
      likes: row.like_count,
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
    .select(
      `
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
    `
    )
    .eq(field, value)
    .eq("status", "approved")
    .maybeSingle();

  if (error) {
    console.error("getSongRowBy error", error);
    return null;
  }
  if (!data) return null;
  return zSongRowWithArtist.parse(data);
}

async function computeSongRankingForScore(score: number): Promise<number> {
  const { count, error } = await supabase
    .from("songs")
    .select("*", { head: true, count: "exact" })
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

  const ranking = await computeSongRankingForScore(row.score);
  return mapSong(row, ranking);
}

export async function getSongById(id: string): Promise<Song | null> {
  const row = await getSongRowBy("id", id);
  if (!row) return null;

  const ranking = await computeSongRankingForScore(row.score);
  return mapSong(row, ranking);
}

export async function getSongsByArtistId(artistId: string): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select(
      `
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
    `
    )
    .eq("artist_id", artistId)
    .eq("status", "approved")
    .order("released_at", { ascending: false });

  if (error) {
    console.error("getSongsByArtistId error", error);
    return [];
  }

  const rows = (data ?? []).map((raw) => zSongRowWithArtist.parse(raw));
  return rows.map((row) => mapSong(row));
}

export async function getSongWithArtists(slug: string) {
  const row = await getSongRowBy("slug", slug);
  if (!row) return null;

  const ranking = await computeSongRankingForScore(row.score);
  const song = mapSong(row, ranking);


  const artist = {
    id: row.artists.id,
    slug: row.artists.slug,
    name: row.artists.display_name,
    profile: {
      avatarUrl: row.artists.avatar_url ?? undefined,
      bannerUrl: undefined,
      bio: undefined,
      socials: {},
    },
    stats: {
      totalViews: song.stats.views,
      totalLikes: song.stats.likes,
      totalSongs: 1,
      ranking: 0,
      memberSince: "",
    },
  };

  return { song, artists: [artist] };
}

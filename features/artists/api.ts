import { supabase } from "@/lib/supabaseClient";
import { zArtistRow, type ArtistRow } from "./schemas";
import type { Artist, ArtistStats } from "./types";
import type { Song } from "@/features/songs/types";
import { getSongsByArtistId } from "@/features/songs/api";

type ArtistStatsBase = {
  totalViews: number;
  totalLikes: number;
  totalSongs: number;
  ranking: number;
};

async function computeArtistStats(artistId: string): Promise<ArtistStatsBase> {
  const { data: mySongs, error: mySongsError } = await supabase
    .from("songs")
    .select("id, artist_id, play_count, like_count, score")
    .eq("artist_id", artistId)
    .eq("status", "approved");

  if (mySongsError) {
    console.error("computeArtistStats mySongsError", mySongsError);
    return { totalViews: 0, totalLikes: 0, totalSongs: 0, ranking: 0 };
  }

  const my = mySongs ?? [];
  const totalViews = my.reduce((acc, s) => acc + (s.play_count ?? 0), 0);
  const totalLikes = my.reduce((acc, s) => acc + (s.like_count ?? 0), 0);
  const totalSongs = my.length;
  const myScore = my.reduce((acc, s) => acc + (s.score ?? 0), 0);

  const { data: allSongs, error: allSongsError } = await supabase
    .from("songs")
    .select("artist_id, score")
    .eq("status", "approved");

  if (allSongsError) {
    console.error("computeArtistStats allSongsError", allSongsError);
    return { totalViews, totalLikes, totalSongs, ranking: 0 };
  }

  const scoresByArtist = new Map<string, number>();
  (allSongs ?? []).forEach((row) => {
    const id = row.artist_id as string;
    const score = row.score ?? 0;
    scoresByArtist.set(id, (scoresByArtist.get(id) ?? 0) + score);
  });

  const sorted = [...scoresByArtist.entries()].sort((a, b) => b[1] - a[1]);
  const position = sorted.findIndex(([id]) => id === artistId);
  const ranking = position >= 0 ? position + 1 : sorted.length || 0;

  return { totalViews, totalLikes, totalSongs, ranking };
}

function mapArtist(row: ArtistRow, statsBase: ArtistStatsBase): Artist {
  const memberSince =
    row.approved_at ??
    row.applied_at ??
    row.created_at ??
    new Date().toISOString();

  const stats: ArtistStats = {
    ...statsBase,
    memberSince,
  };

  return {
    id: row.id,
    slug: row.slug,
    name: row.display_name,
    profile: {
      bannerUrl: row.banner_url ?? undefined,
      avatarUrl: row.avatar_url ?? undefined,
      bio: row.bio ?? undefined,
      socials: row.socials ?? undefined,
    },
    stats,
  };
}


async function getArtistRowBy(
  field: "id" | "slug",
  value: string
): Promise<ArtistRow | null> {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq(field, value)
    .eq("status", "approved")
    .maybeSingle();

  if (error) {
    console.error("getArtistRowBy error", error);
    return null;
  }
  if (!data) return null;
  return zArtistRow.parse(data);
}

export async function getArtistById(id: string): Promise<Artist | null> {
  const row = await getArtistRowBy("id", id);
  if (!row) return null;

  const statsBase = await computeArtistStats(row.id);
  return mapArtist(row, statsBase);
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const row = await getArtistRowBy("slug", slug);
  if (!row) {
    const byId = await getArtistRowBy("id", slug);
    if (!byId) return null;
    const statsBase = await computeArtistStats(byId.id);
    return mapArtist(byId, statsBase);
  }

  const statsBase = await computeArtistStats(row.id);
  return mapArtist(row, statsBase);
}


export async function getArtistsByIds(ids: string[]): Promise<Artist[]> {
  const unique = [...new Set(ids)];
  if (!unique.length) return [];

  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .in("id", unique)
    .eq("status", "approved");

  if (error) {
    console.error("getArtistsByIds error", error);
    return [];
  }

  const statsCache = new Map<string, ArtistStatsBase>();

  async function getStatsFor(id: string): Promise<ArtistStatsBase> {
    if (statsCache.has(id)) return statsCache.get(id)!;
    const base = await computeArtistStats(id);
    statsCache.set(id, base);
    return base;
  }

  const rows = (data ?? []).map((raw) => zArtistRow.parse(raw));
  const result: Artist[] = [];

  for (const row of rows) {
    const statsBase = await getStatsFor(row.id);
    result.push(mapArtist(row, statsBase));
  }

  return result;
}

export async function getArtistTopSongs(
  artistId: string,
  { limit = 10 } = {}
): Promise<Song[]> {
  return (await getSongsByArtistId(artistId)).slice(0, limit);
}

export async function getArtistSongs(artistId: string): Promise<Song[]> {
  return getSongsByArtistId(artistId);
}

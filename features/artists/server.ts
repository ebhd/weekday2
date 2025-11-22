import "server-only";
import { cache } from "react";
import { supabase } from "@/lib/supabaseClient";
import { zArtistRow, type ArtistRow } from "./schemas";
import type { Artist, ArtistStats } from "./types";
import type { Song } from "@/features/songs/types";
import { getSongsByArtistId } from "@/features/songs/server";

type ArtistStatsBase = {
  totalViews: number;
  totalLikes: number;
  totalSongs: number;
  ranking: number;
};

function scoreFromCounts(views: number, likes: number, score?: number | null) {
  return score ?? views + likes * 3;
}

const getArtistStatsMap = cache(
  async (): Promise<Map<string, ArtistStatsBase>> => {
    const { data, error } = await supabase
      .from("songs")
      .select("artist_id, play_count, like_count, score")
      .eq("status", "approved");

    if (error) {
      console.error("getArtistStatsMap error", error);
      return new Map();
    }

    const songs = data ?? [];

    const agg = new Map<
      string,
      {
        totalViews: number;
        totalLikes: number;
        totalSongs: number;
        totalScore: number;
      }
    >();

    for (const s of songs) {
      const artistId = s.artist_id as string;
      const views = s.play_count ?? 0;
      const likes = s.like_count ?? 0;
      const sc = scoreFromCounts(views, likes, s.score);

      const prev = agg.get(artistId);
      if (!prev) {
        agg.set(artistId, {
          totalViews: views,
          totalLikes: likes,
          totalSongs: 1,
          totalScore: sc,
        });
      } else {
        prev.totalViews += views;
        prev.totalLikes += likes;
        prev.totalSongs += 1;
        prev.totalScore += sc;
      }
    }

    // ranking by totalScore
    const sorted = [...agg.entries()].sort(
      (a, b) => b[1].totalScore - a[1].totalScore
    );
    const rankMap = new Map(sorted.map(([id], i) => [id, i + 1]));

    const statsMap = new Map<string, ArtistStatsBase>();
    for (const [id, a] of agg.entries()) {
      statsMap.set(id, {
        totalViews: a.totalViews,
        totalLikes: a.totalLikes,
        totalSongs: a.totalSongs,
        ranking: rankMap.get(id) ?? 0,
      });
    }

    return statsMap;
  }
);

function mapArtist(row: ArtistRow, statsBase: ArtistStatsBase): Artist {
  const memberSince =
    row.approved_at ??
    row.applied_at ??
    row.created_at ??
    new Date().toISOString();

  const stats: ArtistStats = { ...statsBase, memberSince };

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

  if (error || !data) return null;

  const parsed = zArtistRow.safeParse(data);
  if (!parsed.success) {
    console.error("Invalid artist row", parsed.error);
    return null;
  }
  return parsed.data;
}

export async function getArtistById(id: string): Promise<Artist | null> {
  const row = await getArtistRowBy("id", id);
  if (!row) return null;

  const statsMap = await getArtistStatsMap();
  const statsBase = statsMap.get(row.id) ?? {
    totalViews: 0,
    totalLikes: 0,
    totalSongs: 0,
    ranking: 0,
  };

  return mapArtist(row, statsBase);
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const normalizedSlug = slug.toLowerCase();
  const row = await getArtistRowBy("slug", normalizedSlug);
  if (row) {
    const statsMap = await getArtistStatsMap();
    const statsBase = statsMap.get(row.id) ?? {
      totalViews: 0,
      totalLikes: 0,
      totalSongs: 0,
      ranking: 0,
    };
    return mapArtist(row, statsBase);
  }

  if (!/^[0-9a-f-]{36}$/i.test(normalizedSlug)) return null;

  return getArtistById(normalizedSlug);
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

  const statsMap = await getArtistStatsMap();

  const rows = (data ?? [])
    .map((raw) => zArtistRow.safeParse(raw))
    .filter((r): r is { success: true; data: ArtistRow } => r.success)
    .map((r) => r.data);

  return rows.map((row) => {
    const statsBase = statsMap.get(row.id) ?? {
      totalViews: 0,
      totalLikes: 0,
      totalSongs: 0,
      ranking: 0,
    };
    return mapArtist(row, statsBase);
  });
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

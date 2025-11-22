import "server-only";
import { supabase } from "@/lib/supabaseClient";
import type { RankingRowProps, ArtistRankingRow } from "./types";
import {
  zRankingSongRow,
  zArtistAggregateSourceRow,
  type RankingSongRow,
  type ArtistAggregateSourceRow,
} from "./schemas";
import { scoreFromCounts } from "@/features/ranking/utils";

export async function getRankingRows(limit = 200): Promise<RankingRowProps[]> {
  const { data, error } = await supabase
    .from("songs")
    .select(
      `
      id,
      slug,
      title,
      audio_url,
      play_count,
      like_count,
      score,
      artists:artist_id!inner (
        id,
        slug,
        display_name,
        avatar_url
      )
    `
    )
    .eq("status", "approved")
    .eq("artists.status", "approved")
    .order("score", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRankingRows error", error);
    return [];
  }

  const parsedRows: RankingSongRow[] = (data ?? [])
    .map((raw) => zRankingSongRow.safeParse(raw))
    .filter((r): r is { success: true; data: RankingSongRow } => r.success)
    .map((r) => r.data);

  return parsedRows.map<RankingRowProps>((row, index) => ({
    rank: index + 1,

    songId: row.id,
    songSlug: row.slug,
    artistId: row.artists.id,
    artistSlug: row.artists.slug,

    songTitle: row.title,
    audioUrl: row.audio_url,
    artistName: row.artists.display_name,
    artistImageUrl: row.artists.avatar_url ?? undefined,

    views: row.play_count ?? 0,
    hearts: row.like_count ?? 0,
    isHearted: false,

    link: `/songs/${row.slug}`,
  }));
}

export async function getTopArtistsRanking(
  limit = 10
): Promise<ArtistRankingRow[]> {
  const { data, error } = await supabase
    .from("songs")
    .select(
      `
      artist_id,
      play_count,
      like_count,
      score,
      artists:artist_id!inner (
        id,
        slug,
        display_name,
        avatar_url
      )
    `
    )
    .eq("status", "approved")
    .eq("artists.status", "approved");

  if (error) {
    console.error("getTopArtistsRanking error", error);
    return [];
  }

  const rows: ArtistAggregateSourceRow[] = (data ?? [])
    .map((raw) => zArtistAggregateSourceRow.safeParse(raw))
    .filter(
      (r): r is { success: true; data: ArtistAggregateSourceRow } => r.success
    )
    .map((r) => r.data);

  const byArtist = new Map<
    string,
    {
      artistId: string;
      artistSlug: string;
      artistName: string;
      artistImageUrl?: string;
      totalViews: number;
      totalHearts: number;
      totalScore: number;
    }
  >();

  for (const row of rows) {
    const key = row.artist_id;
    const views = row.play_count ?? 0;
    const likes = row.like_count ?? 0;
    const score = scoreFromCounts(views, likes, row.score);

    const existing = byArtist.get(key);

    if (!existing) {
      byArtist.set(key, {
        artistId: row.artists.id,
        artistSlug: row.artists.slug,
        artistName: row.artists.display_name,
        artistImageUrl: row.artists.avatar_url ?? undefined,
        totalViews: views,
        totalHearts: likes,
        totalScore: score,
      });
    } else {
      existing.totalViews += views;
      existing.totalHearts += likes;
      existing.totalScore += score;
    }
  }

  const aggregated = [...byArtist.values()].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  return aggregated.slice(0, limit).map<ArtistRankingRow>((artist, index) => ({
    rank: index + 1,

    artistId: artist.artistId,
    artistSlug: artist.artistSlug,
    artistName: artist.artistName,
    artistImageUrl: artist.artistImageUrl,

    totalViews: artist.totalViews,
    totalHearts: artist.totalHearts,

    link: `/artists/${artist.artistSlug}`,
  }));
}

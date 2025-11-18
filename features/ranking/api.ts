import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import type { RankingRowProps, ArtistRankingRow } from "./types";

const zRankingSongRow = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  audio_url: z.string(),
  play_count: z.number().int(),
  like_count: z.number().int(),
  score: z.number().int(),
  artists: z.object({
    id: z.string().uuid(),
    slug: z.string(),
    display_name: z.string(),
    avatar_url: z.string().nullable(),
  }),
});

type RankingSongRow = z.infer<typeof zRankingSongRow>;

/**
 * SONG ranking: used by the main table.
 */
export async function getRankingRows(): Promise<RankingRowProps[]> {
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
      artists:artist_id (
        id,
        slug,
        display_name,
        avatar_url
      )
    `
    )
    .eq("status", "approved")
    .order("score", { ascending: false });

  if (error) {
    console.error("getRankingRows error", error);
    return [];
  }

  const rows = (data ?? []).map((raw) => zRankingSongRow.parse(raw));

  return rows.map<RankingRowProps>((row, index) => ({
    rank: index + 1,
    songId: row.id,
    songSlug: row.slug,
    artistId: row.artists.id,
    artistSlug: row.artists.slug,
    songTitle: row.title,
    audioUrl: row.audio_url,
    artistName: row.artists.display_name,
    artistImageUrl: row.artists.avatar_url ?? undefined,
    views: row.play_count,
    hearts: row.like_count,
    isHearted: false,
    link: `/songs/${row.slug}`,
  }));
}

const zArtistAggregateSourceRow = z.object({
  artist_id: z.string().uuid(),
  play_count: z.number().int().nullable(),
  like_count: z.number().int().nullable(),
  score: z.number().int().nullable(),
  artists: z.object({
    id: z.string().uuid(),
    slug: z.string(),
    display_name: z.string(),
    avatar_url: z.string().nullable(),
  }),
});

type ArtistAggregateSourceRow = z.infer<typeof zArtistAggregateSourceRow>;

/**
 * ARTIST ranking: aggregate all approved songs per artist.
 * Used for side ArtistCards and future "Top Artists" views.
 */
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
      artists:artist_id (
        id,
        slug,
        display_name,
        avatar_url
      )
    `
    )
    .eq("status", "approved");

  if (error) {
    console.error("getTopArtistsRanking error", error);
    return [];
  }

  const rows: ArtistAggregateSourceRow[] = (data ?? []).map((raw) =>
    zArtistAggregateSourceRow.parse(raw)
  );

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
    const existing = byArtist.get(key);

    const views = row.play_count ?? 0;
    const likes = row.like_count ?? 0;
    const score = row.score ?? views + likes * 3;

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

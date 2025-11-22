import { z } from "zod";

export const zRankingSongRow = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  audio_url: z.string(),
  play_count: z.number().int(),
  like_count: z.number().int(),
  score: z.number().int(),
  artists: z.object({
    id: z.uuid(),
    slug: z.string(),
    display_name: z.string(),
    avatar_url: z.string().nullable(),
  }),
});
export type RankingSongRow = z.infer<typeof zRankingSongRow>;

export const zArtistAggregateSourceRow = z.object({
  artist_id: z.uuid(),
  play_count: z.number().int().nullable(),
  like_count: z.number().int().nullable(),
  score: z.number().int().nullable(),
  artists: z.object({
    id: z.uuid(),
    slug: z.string(),
    display_name: z.string(),
    avatar_url: z.string().nullable(),
  }),
});
export type ArtistAggregateSourceRow = z.infer<
  typeof zArtistAggregateSourceRow
>;

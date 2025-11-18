import { z } from "zod";

export const zSearchSongRow = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  play_count: z.number().int().nullable(),
  like_count: z.number().int().nullable(),
  score: z.number().int().nullable(),
  artists: z.object({
    id: z.string().uuid(),
    slug: z.string(),
    display_name: z.string(),
  }),
});

export type SearchSongRow = z.infer<typeof zSearchSongRow>;

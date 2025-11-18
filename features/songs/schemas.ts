import { z } from "zod";

export const zSongRowWithArtist = z.object({
  id: z.uuid(),
  artist_id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  audio_url: z.string(),
  cover_url: z.string().nullable(),
  duration_sec: z.number().int().nullable(),
  has_lyrics: z.boolean().nullable(),
  released_at: z.string().nullable(),

  play_count: z.number().int(),
  like_count: z.number().int(),
  dislike_count: z.number().int(),
  score: z.number().int(),

  artists: z.object({
    id: z.string().uuid(),
    slug: z.string(),
    display_name: z.string(),
    avatar_url: z.string().nullable(),
  }),
});

export type SongRowWithArtist = z.infer<typeof zSongRowWithArtist>;

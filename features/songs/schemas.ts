import { z } from "zod";

const zInt0 = z.coerce.number().int().nonnegative().catch(0);

export const zSongRowWithArtist = z.object({
  id: z.uuid(),
  artist_id: z.uuid(),
  title: z.string(),
  slug: z.string(),
  audio_url: z.string(),

  cover_url: z.string().nullable(),
  duration_sec: z.coerce.number().int().nullable().catch(null),
  has_lyrics: z.coerce.boolean().nullable().catch(null),
  released_at: z.string().nullable(),

  play_count: zInt0,
  like_count: zInt0,
  dislike_count: zInt0,
  score: z.coerce.number().int().nullable().catch(null),

  artists: z.object({
    id: z.uuid(),
    slug: z.string(),
    display_name: z.string(),
    avatar_url: z.string().nullable(),
  }),
});

export type SongRowWithArtist = z.infer<typeof zSongRowWithArtist>;
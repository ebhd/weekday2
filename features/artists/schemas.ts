import { z } from "zod";

export const zArtistRow = z.object({
  id: z.uuid(),
  user_id: z.string().uuid(),
  slug: z.string(),
  display_name: z.string(),
  bio: z.string().nullable(),
  avatar_url: z.string().nullable(),
  banner_url: z.string().nullable(),
  socials: z.record(z.string(), z.string()).nullable(),

  status: z.enum(["pending", "approved", "rejected", "disabled"]),
  applied_at: z.string().nullable(),
  approved_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ArtistRow = z.infer<typeof zArtistRow>;

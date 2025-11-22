// features/profile/schemas.ts
import { z } from "zod";

export const zUserProfileUpdateBody = z.object({
  username: z.string().min(3).max(32).optional(),
});

export const zPasswordUpdateBody = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(72),
});

// --------------------
// Artist profile schemas
// --------------------

// kebab-case slug, short, no spaces, no weird chars
export const zArtistSlug = z
  .string()
  .min(3)
  .max(40)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, {
    message: "Slug must be kebab-case (letters, numbers, hyphens).",
  })
  .transform((s) => s.toLowerCase().trim());

export const zArtistProfileUpdateBody = z.object({
  slug: zArtistSlug.optional(),
  displayName: z.string().min(2).max(64).optional(),
  bio: z.string().max(600).nullable().optional(),
  socials: z.record(z.string(), z.url()).nullable().optional(),
});

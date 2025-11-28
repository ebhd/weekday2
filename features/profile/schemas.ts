//  features/profile/schemas.ts
import { z } from "zod";
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const zUserProfileUpdateBody = z.object({
  username: z.string().min(3).max(32).optional(),
});

export const zPasswordUpdateBody = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(72),
});

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

export const zBeArtistBody = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(slugRegex, "Slug must be kebab-case (letters, numbers, hyphens)"),
  displayName: z.string().trim().min(2).max(64),
  bio: z.string().trim().max(600).nullable().optional(),
  socials: z.record(z.string(), z.url()).nullable().optional(),
});

export type BeArtistBody = z.infer<typeof zBeArtistBody>;

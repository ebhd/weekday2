// features/my-songs/schemas.ts
import { z } from "zod";

export const zCreateSongBody = z.object({
  title: z.string().min(1).max(120),
});

export const zUpdateSongBody = z.object({
  title: z.string().min(1).max(120),
  slug: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  isDownloadable: z.boolean(),
});

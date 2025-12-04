// features/blogs/schema.ts
import { z } from "zod";

export const blogCommentInsertSchema = z.object({
  postSlug: z.string().min(1, "Missing post slug"),
  authorName: z.string().min(1, "Name is required").max(50, "Name is too long"),
  authorHandle: z
    .string()
    .max(50, "Handle is too long")
    .optional()
    .or(z.literal("")),
  body: z
    .string()
    .min(3, "Comment is too short")
    .max(1000, "Comment is too long"),
});

export type BlogCommentInsertInput = z.infer<typeof blogCommentInsertSchema>;

export const blogPostInsertSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be URL-friendly"),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  authorId: z.string().uuid(),
  publishedAt: z.string().datetime().nullable().optional(),
  readingTimeMinutes: z.number().int().positive().max(60).nullable().optional(),
  tagSlugs: z.array(z.string()).default([]),
});

export type BlogPostInsertInput = z.infer<typeof blogPostInsertSchema>;

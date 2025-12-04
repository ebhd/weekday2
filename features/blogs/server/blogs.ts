// features/blogs/server/blogs.ts
import { supabaseBlogs } from "@/lib/supabaseBlogs";
import type { BlogPost, BlogTag, BlogAuthor, BlogComment } from "../types";

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabaseBlogs
    .from("posts")
    .select(
      `
      id,
      slug,
      title,
      content,
      published_at,
      reading_time_minutes,
      authors:author_id (
        id,
        handle,
        name
      ),
      post_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `
    )
    .eq("status", "published");

  if (error) {
    console.error("Error fetching posts", error);
    return [];
  }

  const avatarForHandle = (handle: string): string | null => {
    const map: Record<string, string> = {
      "ebrahim-hdida": "/team/ebrahim.jpg",
      "alfie-vercammen": "/team/alfie.jpg",
      "dries-vanderstukken": "/team/dries.jpg",
      "ilias-benabdellah": "/team/illias.jpg",
      "yasmine-rahou": "/team/yasmine.jpg",
    };
    return map[handle] ?? null;
  };

  const posts: BlogPost[] = (data ?? []).map(
    (p: any): BlogPost => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      content: p.content,
      author: {
        id: p.authors.id,
        handle: p.authors.handle,
        name: p.authors.name,
        avatarUrl: avatarForHandle(p.authors.handle),
      },
      publishedAt: p.published_at,
      readingTimeMinutes: p.reading_time_minutes,
      tags: (p.post_tags ?? []).map((pt: any): BlogTag => pt.tags),
      comments: [],
    })
  );

  for (let i = posts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [posts[i], posts[j]] = [posts[j], posts[i]];
  }

  return posts;
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const { data, error } = await supabaseBlogs
    .from("posts")
    .select(
      `
      id,
      slug,
      title,
      content,
      published_at,
      reading_time_minutes,
      authors:author_id (
        id,
        handle,
        name
      ),
      post_tags (
        tags (
          id,
          name,
          slug
        )
      ),
      comments (
        id,
        author_name,
        author_handle,
        body,
        is_approved,
        created_at
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    console.error("Error fetching post", error);
    return null;
  }

  const avatarForHandle = (handle: string): string | null => {
    const map: Record<string, string> = {
      "ebrahim-hdida": "/team/ebrahim.jpg",
      "alfie-vercammen": "/team/alfie.jpg",
      "dries-vanderstukken": "/team/dries.jpg",
      "ilias-benabdellah": "/team/illias.jpg",
      "yasmine-rahou": "/team/yasmine.jpg",
    };
    return map[handle] ?? null;
  };

  const p: any = data;

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    content: p.content,
    author: {
      id: p.authors.id,
      handle: p.authors.handle,
      name: p.authors.name,
      avatarUrl: avatarForHandle(p.authors.handle),
    },
    publishedAt: p.published_at,
    readingTimeMinutes: p.reading_time_minutes,
    tags: (p.post_tags ?? []).map((pt: any): BlogTag => pt.tags),
    comments: (p.comments ?? []).map(
      (c: any): BlogComment => ({
        id: c.id,
        postId: p.id,
        authorName: c.author_name,
        authorHandle: c.author_handle,
        body: c.body,
        isApproved: c.is_approved,
        createdAt: c.created_at,
      })
    ),
  };
}

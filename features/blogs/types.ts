// features/blogs/types.ts

export type BlogAuthor = {
  id: string; // uuid in DB
  handle: string; // "ebrahim-hdida"
  name: string; // "Ebrahim Hdida"
  avatarUrl?: string | null;
};

export type BlogTag = {
  id: number; // serial in DB
  name: string; // "writing"
  slug: string; // "writing"
};

export type BlogComment = {
  id: string; // uuid
  postId: string;
  authorName: string;
  authorHandle?: string | null;
  body: string;
  isApproved: boolean;
  createdAt: string;
};

export type BlogPost = {
  id: string; // uuid
  slug: string;
  title: string;
  content: string;
  author: BlogAuthor;
  publishedAt: string | null;
  readingTimeMinutes: number | null;
  tags: BlogTag[];
  comments: BlogComment[];
};

// app/blog/[blogid]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import blogPosts from "@/app/(marketing)/blog/data.json";

type Comment = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  publishedAt?: string;
  readingTimeMinutes?: number;
  tags?: string[];
  content: string;
  comments?: Comment[];
};

type BlogPageProps = {
  params: {
    blogid: string;
  };
};

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { blogid } = await params;

  const posts = blogPosts as BlogPost[];
  const post = posts.find((p) => p.slug === blogid);

  console.log(blogid);
  console.log(post);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto md:px-80 px-4 py-20 sm:py-12 lg:py-16">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-fg hover:text-(--color-primary)"
          >
            <span className=" h-5 w-5 rounded-full border border-border bg-surface text-[0.65rem] leading-[1.1] flex items-center justify-center">
              ←
            </span>
            Back to blog
          </Link>
        </div>

        {/* Meta row */}
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--color-muted-fg)]">
          {post.publishedAt && (
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          {post.readingTimeMinutes && (
            <span className="inline-flex items-center gap-1">
              •<span>{post.readingTimeMinutes} min read</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            •<span className="font-mono text-[0.7rem]">/blog/{post.slug}</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
          {post.title}
        </h1>

        {/* Author */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold">
            {post.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{post.author.name}</span>
            <span className="text-xs text-[var(--color-muted-fg)]">
              @{post.author.id}
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[rgba(64,255,80,0.04)] px-3 py-1 text-[0.7rem] font-medium text-[var(--color-muted-fg)]"
              >
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="mt-6 h-px w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] opacity-70" />

        {/* Content */}
        <article className="prose prose-invert max-w-none prose-p:mt-0 prose-headings:mt-8 prose-headings:mb-3 prose-p:mb-4 prose-li:marker:text-[var(--color-primary)] mt-8 text-sm sm:text-base leading-relaxed text-[var(--color-foreground)]">
          <p>{post.content}</p>
        </article>

        {/* Comments */}
        {post.comments && post.comments.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm sm:text-base font-semibold">
              Comments{" "}
              <span className="ml-1 text-xs text-[var(--color-muted-fg)]">
                ({post.comments.length})
              </span>
            </h2>

            <div className="mt-4 space-y-3">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-muted-fg)]">
                    <span className="font-medium text-[var(--color-foreground)]">
                      {comment.author}
                    </span>
                    <span className="text-[0.7rem]">
                      {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--color-foreground)]">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

/**
 * Optional: enable static generation for all blog slugs
 * Uncomment if you want SSG.
 */
// export function generateStaticParams() {
//   const posts = blogPosts as BlogPost[];
//   return posts.map((post) => ({
//     blogid: post.slug,
//   }));
// }

// app/blog/page.tsx  (App Router)
// or pages/blog/index.tsx (Pages Router)

import Link from "next/link";
import blogPosts from "@/app/(marketing)/blog/data.json";

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  tags?: string[];
  publishedAt?: string;
};

export default function Blog() {
  const posts = blogPosts as BlogPost[];

  return (
    <main className="min-h-screen md:px-48 px-4 bg-background text-foreground">
      <div className="mx-auto px-4 py-10 sm:py-12 lg:py-16">
        
        <header className="mb-8 sm:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
            Blog
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold">
            Latest articles
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-fg">
            Read insights, research, and updates from our authors. Click a post
            to open the blog.
          </p>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-4 sm:p-5 transition-all  hover:border-(--color-primary) hover:bg-hover"
            >
              <div className="mb-2 flex items-center justify-between text-xs text-muted-fg">
                <span className="font-mono truncate max-w-[60%]">
                  {post.slug}
                </span>
                {post.publishedAt && (
                  <span className="text-[0.7rem] sm:text-xs">
                    {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              <h2 className="line-clamp-2 text-base sm:text-lg font-semibold tracking-tight group-hover:text-(--color-primary)">
                {post.title}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-xs text-muted-fg">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-[0.65rem] font-medium border border-border">
                  {post.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">
                    {post.author.name}
                  </span>
                  <span className="text-[0.7rem] text-muted-fg">
                    @{post.author.id}
                  </span>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-border bg-[rgba(64,255,80,0.04)] px-2.5 py-1 text-[0.7rem] font-medium text-muted-fg group-hover:border-(--color-primary)"
                    >
                      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-(--color-primary)" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="pointer-events-none mt-4 h-px w-full bg-linear-to-r from-(--color-primary) via-secondary to-accent opacity-60 group-hover:opacity-100" />
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

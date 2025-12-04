import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts } from "@/features/blogs/server/blogs";

export default async function Blog() {
  const posts = await getAllBlogPosts();

  return (
    <main className="min-h-screen xl:px-48 lg:px-20 md:px-10 px-4 bg-background text-foreground">
      <div className="mx-auto px-4 py-10 sm:py-12 lg:py-16">
        <header className="mb-8 sm:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
            Blog
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold">
            Latest Blogs
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-fg">
            Read insights, research, and updates from our authors. Click a post
            to open the blog.
          </p>
        </header>

        <section className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block h-full relative rounded-2xl bg-gradient-to-br from-primary/10 via-border/20 to-secondary/20 p-[1px] transition-all duration-300 hover:from-primary/40 hover:via-secondary/40 hover:to-accent/40"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-surface/95 px-4 py-4 sm:px-5 sm:py-5 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/80 group-hover:shadow-[0_0_17px_rgba(64,255,80,0.25)]">
                <div className="mb-2 flex items-center justify-between text-[0.7rem] text-muted-fg">
                  <span className="font-mono truncate max-w-[55%] opacity-80">
                    {post.slug}
                  </span>
                  <div className="flex items-center gap-2">
                    {post.readingTimeMinutes && (
                      <span className="rounded-full border border-border/70 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide">
                        {post.readingTimeMinutes} min
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="text-[0.7rem] sm:text-xs">
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h2 className="line-clamp-2 text-base sm:text-lg font-semibold tracking-tight group-hover:text-primary">
                  {post.title}
                </h2>

                {/* Sneak peek content */}
                {post.content && (
                  <div className="relative mt-3">
                    <p className="text-xs sm:text-sm text-muted-fg/90 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
                  </div>
                )}

                {/* Author with avatar */}
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-fg">
                  <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-background border border-border/70">
                    <Image
                      src={post.author.avatarUrl ?? "/team/default.jpg"}
                      alt={post.author.name}
                      width={28}
                      height={28}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">
                      {post.author.name}
                    </span>
                    <span className="text-[0.7rem] text-muted-fg">
                      @{post.author.handle}
                    </span>
                  </div>
                </div>

                {/* Tags row */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center rounded-full border border-border bg-[rgba(64,255,80,0.04)] px-2.5 py-1 text-[0.7rem] font-medium text-muted-fg transition-colors group-hover:border-primary/70"
                      >
                        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pointer-events-none mt-4 h-px w-full bg-gradient-to-r from-primary via-secondary to-accent opacity-70 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

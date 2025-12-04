// app/(marketing)/blog/[blogid]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/features/blogs/server/blogs";
import { CommentSection } from "@/app/(marketing)/blog/[blogid]/CommentForm";

const HIGHLIGHTED_SUBTITLES = new Set<string>([
  // Ebrahim
  "Financial Struggle",
  "Algorithm",
  "AI’s positive Impact On Underground Music",
  "AI Negative Impact On Underground Music",
  "My personal opinion",
  "Why Underground Artists Are Special",
  "Createtivity and freedom:",
  "Authenticity:",
  "Cultural impact:",
  "My Opinion",

  // Ilias
  "Introduction",
  "Main content",
  "References",
  "References:",

  // Yasmine
  "Sources:",
  "Sources",

  // Alfie
  "sources:",
]);

type BlogPageProps = {
  params: {
    blogid: string;
  };
};

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { blogid } = await params;

  const post = await getBlogPostBySlug(blogid);

  if (!post) {
    notFound();
  }

  return (
    <main
      className="relative min-h-screen 
            bg-linear-to-b
             from-background/5 
             via-background/90
             to-background 
             text-foreground"
    >
      {" "}
      {/* ambient background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(64,255,80,0.18),transparent_60%)] blur-2xl" />
        <div className="absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(77,83,213,0.16),transparent_60%)] blur-2xl" />
        <div className="absolute bottom-[-8rem] left-1/4 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(78,199,88,0.18),transparent_65%)] blur-3xl" />
      </div>
      <div className="mx-auto max-w-4xl px-4 py-20 sm:py-16 lg:py-18">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-xs font-medium text-muted-fg hover:text-(--color-primary)"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface text-[0.65rem] leading-[1.1]">
              ←
            </span>
            Back to blog
          </Link>
        </div>

        {/* Header block */}
        <header className="mb-8 border-b border-border/70 pb-6">
          {/* chip row */}
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-fg">
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
              <span className="rounded-full border border-border/70 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide">
                {post.readingTimeMinutes} min read
              </span>
            )}
            <span className="font-mono text-[0.7rem] opacity-70">
              /blog/{post.slug}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Author + tags */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* author */}
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_160deg,rgba(64,255,80,0.3),rgba(77,83,213,0.2),transparent)] blur-sm" />
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                  <Image
                    src={post.author.avatarUrl ?? "/team/default.jpg"}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{post.author.name}</span>
                <span className="text-xs text-muted-fg">
                  @{post.author.handle}
                </span>
              </div>
            </div>

            {/* tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full border border-border bg-[rgba(64,255,80,0.06)] px-3 py-1 text-[0.7rem] font-medium text-muted-fg"
                  >
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-(--color-primary)" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <article className="relative text-sm sm:text-base leading-relaxed text-foreground">
          <div className="pointer-events-none absolute -left-3 top-0 hidden h-full w-px bg-gradient-to-b from-(--color-primary) via-transparent to-(--color-secondary) sm:block" />

          <div>
            {(() => {
              const lines = post.content.split(/\r?\n/);

              type Block =
                | { type: "subtitle"; text: string }
                | { type: "paragraph"; text: string };

              const blocks: Block[] = [];
              let currentParagraphLines: string[] = [];

              const flushParagraph = () => {
                if (currentParagraphLines.length === 0) return;
                blocks.push({
                  type: "paragraph",
                  text: currentParagraphLines.join("\n"),
                });
                currentParagraphLines = [];
              };

              for (const line of lines) {
                const trimmed = line.trim();

                if (!trimmed) {
                  flushParagraph();
                  continue;
                }

                // subtitle line
                if (HIGHLIGHTED_SUBTITLES.has(trimmed)) {
                  flushParagraph();
                  blocks.push({ type: "subtitle", text: trimmed });
                  continue;
                }

                // normal content
                currentParagraphLines.push(line);
              }

              // final paragraph
              flushParagraph();

              return blocks.map((block, idx) => {
                if (block.type === "subtitle") {
                  return (
                    <h2
                      key={idx}
                      className="mt-6 text-base sm:text-2xl font-semibold font-display"
                    >
                      {block.text}
                    </h2>
                  );
                }

                return (
                  <p
                    key={idx}
                    className="mt-3 whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-[var(--color-foreground)]"
                  >
                    {block.text}
                  </p>
                );
              });
            })()}
          </div>
        </article>

        <CommentSection
          postId={post.id}
          initialComments={post.comments ?? []}
        />
      </div>
    </main>
  );
}

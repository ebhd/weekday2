"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Comment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

type CommentSectionProps = {
  postId: string;
  initialComments: Comment[];
};

export function CommentSection({
  postId,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments ?? []);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!authorName.trim() || !body.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/blog/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId,
            authorName,
            body,
          }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          setError(json.error ?? "Something went wrong posting your comment.");
          return;
        }

        const newComment: Comment = await res.json();

        setComments((prev) => [newComment, ...prev]);
        setAuthorName("");
        setBody("");
      } catch (err) {
        console.error("Failed to post comment", err);
        setError("Network error – please try again.");
      }
    });
  };

  return (
    <section className="mt-12 space-y-8 border-t border-border/70 pt-8">
      {/* Comments list */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm sm:text-base font-semibold">
            Comments{" "}
            <span className="ml-1 text-xs text-muted-fg">
              ({comments.length})
            </span>
          </h2>
        </div>

        {comments.length === 0 ? (
          <p className="text-xs sm:text-sm text-muted-fg">
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-2xl border border-border/80 bg-surface/60 p-4 backdrop-blur-sm"
              >
                <div className="mb-1 flex items-center justify-between text-xs text-muted-fg">
                  <span className="font-medium text-foreground">
                    {comment.authorName}
                  </span>
                  <span className="text-[0.7rem]">
                    {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap break-words max-w-full">
                  {comment.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment form */}
      <div
        className="
          rounded-2xl border border-border/80 bg-surface/70 
          p-4 sm:p-5 backdrop-blur-sm
          relative overflow-hidden
        "
      >
        {/* subtle gradient edge */}
        <div className="pointer-events-none absolute inset-px rounded-[1rem] border border-[rgba(64,255,80,0.15)]/60" />
        <div className="pointer-events-none absolute -inset-20 bg-[radial-gradient(circle_at_top,rgba(64,255,80,0.12),transparent_60%)] opacity-70" />

        <form onSubmit={handleSubmit} className="relative space-y-4">
          <h3 className="text-sm font-semibold">Leave a comment</h3>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,0.35fr)_minmax(0,1.65fr)] sm:items-start">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted-fg">
                Display name
              </label>
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name"
                className="h-9 bg-background/60 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted-fg">
                Comment
              </label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your thoughts about this blog..."
                rows={3}
                className="min-h-[96px] resize-y bg-background/60 text-xs sm:text-sm"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.7rem] text-muted-fg">
              Your comment will be publicly visible.
            </p>
            <Button
              type="submit"
              size="sm"
              className="self-end bg-(--color-primary) text-black hover:bg-[rgba(64,255,80,0.85)]"
              disabled={isPending}
            >
              {isPending ? "Posting..." : "Post comment"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

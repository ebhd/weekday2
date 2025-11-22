"use client";

import * as React from "react";
import Link from "next/link";
import { apiPatch } from "@/features/admin/client/adminApi";
import type { AdminSubmitSongRow } from "@/features/admin/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  initialSongs: AdminSubmitSongRow[];
};

export function SubmitsClient({ initialSongs }: Props) {
  const [songs, setSongs] = React.useState(initialSongs);
  const [mutating, setMutating] = React.useState<Record<string, boolean>>({});
  const [error, setError] = React.useState<string | null>(null);

  async function moderate(songId: string, status: "approved" | "rejected") {
    setError(null);
    setMutating((m) => ({ ...m, [songId]: true }));

    // optimistic remove from list
    const prev = songs;
    setSongs((s) => s.filter((x) => x.id !== songId));

    try {
      await apiPatch(`/api/admin/songs/${songId}/status`, { status });
    } catch (e: any) {
      console.error("moderate error", e);
      setSongs(prev);
      setError(e?.message ?? "Failed to update submission");
    } finally {
      setMutating((m) => ({ ...m, [songId]: false }));
    }
  }
  

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Pending songs ({songs.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {songs.length === 0 ? (
            <p className="text-sm text-white/60">No pending submissions 🎉</p>
          ) : (
            <ul className="space-y-2">
              {songs.map((song) => {
                const busy = !!mutating[song.id];

                return (
                  <li
                    key={song.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:flex-row md:items-center md:justify-between"
                  >
                    {/* left */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/songs/${song.slug}`}
                          className="truncate font-medium hover:underline"
                        >
                          {song.title}
                        </Link>
                        <span className="text-xs text-white/50">
                          by {song.artistName ?? "Unknown artist"}
                        </span>
                      </div>

                      <div className="text-xs text-white/50 flex flex-wrap gap-3">
                        <span>
                          Submitted {new Date(song.createdAt).toLocaleString()}
                        </span>
                        {song.durationSec != null && (
                          <span>{song.durationSec}s</span>
                        )}
                      </div>

                      {/* audio preview */}
                      <audio
                        controls
                        preload="none"
                        className="mt-2 w-full max-w-md"
                      >
                        <source src={song.audioUrl} />
                      </audio>
                    </div>

                    {/* right actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() => moderate(song.id, "approved")}
                        className="bg-green-500/20 text-green-200 border border-green-500/30 hover:bg-green-500/30 cursor-pointer"
                      >
                        {busy ? "..." : "Approve"}
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busy}
                        onClick={() => moderate(song.id, "rejected")}
                        className="bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30 cursor-pointer"
                      >
                        {busy ? "..." : "Reject"}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

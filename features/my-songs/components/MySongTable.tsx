// features/my-songs/components/MySongTable.tsx
"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MySongRow } from "../types";
import { EditSongDialog } from "./EditSongDialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { notifyError, notifySuccess } from "@/features/notifications/store";
type Props = {
  songs: MySongRow[];
  onUpdated: (song: MySongRow) => void;
  onDeleted: (songId: string) => void;
};

export function MySongsTable({ songs, onUpdated, onDeleted }: Props) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function deleteSong(songId: string) {
    setDeletingId(songId);
    try {
      const res = await fetch(`/api/profile/artist/songs/${songId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");

      onDeleted(songId);
    } catch (e) {
      console.error(e);

      notifyError("Delete failed. Try again.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!songs.length) {
    return (
      <div className="rounded-2xl border border-muted-fg/30 bg-black/30 p-6 text-white/70">
        You haven’t uploaded any songs yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-muted-fg/30 bg-surface overflow-hidden">
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_170px] px-4 py-3 text-xs text-white/60 bg-black/40">
        <div>Title</div>
        <div>Slug</div>
        <div>Status</div>
        <div>Created</div>
        <div>Approved</div>
        <div className="text-right">Actions</div>
      </div>

      <div className="divide-y divide-white/10">
        {songs.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_170px] px-4 py-3 text-sm items-center"
          >
            <div className="truncate">{s.title}</div>
            <div className="truncate text-white/60">{s.slug}</div>

            <div>
              <Badge variant="secondary" className="capitalize">
                {s.status}
              </Badge>
            </div>

            <div className="text-white/60 text-xs">
              {new Date(s.createdAt).toLocaleDateString()}
            </div>

            <div className="text-white/60 text-xs">
              {s.approvedAt ? new Date(s.approvedAt).toLocaleDateString() : "—"}
            </div>

            <div className="flex justify-end gap-2">
              <EditSongDialog song={s} onUpdated={onUpdated} />

              <Button asChild size="sm" variant="ghost">
                <a href={s.audioUrl} target="_blank" rel="noreferrer">
                  Listen
                </a>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deletingId === s.id}
                  >
                    {deletingId === s.id ? "Deleting..." : "Delete"}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-black/95 border-white/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this song?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/70">
                      This will remove the song from your profile and rankings.
                      You can’t undo this.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteSong(s.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

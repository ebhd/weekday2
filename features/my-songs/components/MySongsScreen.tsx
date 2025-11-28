// features/my-songs/components/MySongsScreen.tsx
"use client";

import * as React from "react";
import type { MySongRow } from "../types";
import { UploadSongCard } from "./UploadSongCard";
import { MySongsTable } from "./MySongTable";

export function MySongsScreen({ initialSongs }: { initialSongs: MySongRow[] }) {
  const [songs, setSongs] = React.useState<MySongRow[]>(initialSongs);

  function onSongCreated(song: MySongRow) {
    setSongs((prev) => [song, ...prev]);
  }

  function onSongUpdated(song: MySongRow) {
    setSongs((prev) => prev.map((s) => (s.id === song.id ? song : s)));
  }

  function onSongDeleted(songId: string) {
    setSongs((prev) => prev.filter((s) => s.id !== songId));
  }

  return (
    <div className="space-y-6">
      <UploadSongCard onCreated={onSongCreated} />
      <MySongsTable
        songs={songs}
        onUpdated={onSongUpdated}
        onDeleted={onSongDeleted}
      />
    </div>
  );
}

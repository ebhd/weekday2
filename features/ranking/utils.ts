import type { Song } from "@/features/songs/types";

export function computeSongScore(song: Song): number {
  return song.stats.views + song.stats.likes * 3;
}

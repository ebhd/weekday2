// features/ranking/utils.ts
import type { Song } from "@/features/songs/types";

export function computeSongScore(song: Song): number {
  return song.stats.views + song.stats.likes * 3;
}

export function scoreFromCounts(
  views: number,
  likes: number,
  score?: number | null
) {
  return score ?? views + likes * 3;
}

import { SONGS } from "@/mocks/songs";
import type { Song } from "./types";
import { getArtistsByIds } from "@/features/artists/api";

const score = (s: Song) => s.stats.views + 3 * s.stats.likes;

export async function getSongBySlug(slug: string): Promise<Song | null> {
  const base = SONGS.find((s) => s.slug === slug);
  if (!base) return null;
  const ranked = [...SONGS].sort((a, b) => score(b) - score(a));
  const ranking = ranked.findIndex((s) => s.id === base.id) + 1;
  return { ...base, stats: { ...base.stats, ranking } };
}
export async function getSongById(id: string): Promise<Song | null> {
  const base = SONGS.find((s) => s.id === id);
  if (!base) return null;
  const ranked = [...SONGS].sort((a, b) => score(b) - score(a));
  const ranking = ranked.findIndex((s) => s.id === base.id) + 1;
  return { ...base, stats: { ...base.stats, ranking } };
}

export async function getSongWithArtists(slug: string) {
  let song = await getSongBySlug(slug);
  if (!song) {
    song = await getSongById(slug);
  }
  if (!song) return null;

  const featuring = ((song as any).featuring ?? []) as { id: string }[];
  const ids = [song.artist.id, ...featuring.map((a) => a.id)];
  const artists = await getArtistsByIds([...new Set(ids)]);
  return { song, artists };
}

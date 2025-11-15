import { ARTISTS } from "@/mocks/artists";
import { SONGS } from "@/mocks/songs";
import type { Artist } from "./types";
import type { Song } from "@/features/songs/types";

export async function getArtistsByIds(ids: string[]): Promise<Artist[]> {
  const want = new Set(ids);
  return ARTISTS.filter((a) => want.has(a.id));
}

const artistScore = (songs: Song[]) =>
  songs.reduce((acc, s) => acc + s.stats.views * 1 + s.stats.likes * 3, 0);

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  let base = ARTISTS.find((a) => a.slug === slug);
  if (!base) {
    base = ARTISTS.find((a) => a.id === slug);
  }

  if (!base) return null;

  const mySongs = SONGS.filter((s) => s.artist.id === base.id);
  const totalViews = mySongs.reduce((a, s) => a + s.stats.views, 0);
  const totalLikes = mySongs.reduce((a, s) => a + s.stats.likes, 0);

  const scores = ARTISTS.map((a) => ({
    id: a.id,
    score: artistScore(SONGS.filter((s) => s.artist.id === a.id)),
  })).sort((x, y) => y.score - x.score);

  const ranking = scores.findIndex((s) => s.id === base.id) + 1;

  return {
    ...base,
    stats: {
      ...base.stats,
      totalViews,
      totalLikes,
      totalSongs: mySongs.length,
      ranking: ranking || ARTISTS.length,
    },
  };
}

export async function getArtistTopSongs(artistId: string, { limit = 10 } = {}) {
  const items = SONGS.filter((s) => s.artist.id === artistId)
    .sort((a, b) => b.stats.views - a.stats.views)
    .slice(0, limit);
  return items;
}

export async function getArtistSongs(artistId: string) {
  return SONGS.filter((s) => s.artist.id === artistId);
}

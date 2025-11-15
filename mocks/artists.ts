import type { Artist } from "@/features/artists/types";
import type { Song } from "@/features/songs/types";
import type { RankingRowProps } from "@/features/ranking/types";
import { SONGS } from "@/mocks/songs";
export const ARTISTS: Artist[] = [
  {
    id: "a1",
    slug: "g-herbo",
    name: "G Herbo",
    profile: {
      bannerUrl: "/banner.png",
      avatarUrl: "/Charlie Wilson.avif",
      bio: "Chicago drill pioneer.",
      socials: { instagram: "https://instagram.com/gherbo" },
    },
    stats: {
      totalViews: 0,
      totalLikes: 0,
      ranking: 0,
      totalSongs: 0,
      memberSince: "2023-08-12",
    },
  },
  {
    id: "a2",
    slug: "rowdy-rebel",
    name: "Rowdy Rebel",
    profile: {
      bannerUrl: "/banner.png",
      avatarUrl: "/Charlie Wilson.avif",
    },
    stats: {
      totalViews: 0,
      totalLikes: 0,
      ranking: 0,
      totalSongs: 0,
      memberSince: "2024-02-01",
    },
  },
];

const score = (s: Song) => s.stats.views * 1 + s.stats.likes * 3;

export const mockRankingRows: RankingRowProps[] = [...SONGS]
  .sort((a, b) => score(b) - score(a))
  .map((s, i) => ({
    rank: i + 1,
    artistsSlug: s.artist.slug,
    artistsName: s.artist.name,
    artistsImagePath: s.artist.avatarUrl ?? "/default-avatar.png",
    songName: s.title,
    songPath: s.audioUrl,
    views: s.stats.views,
    hearts: s.stats.likes,
    isHearted: false,
    link: `/songs/${s.id}`,
  }));

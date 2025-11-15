import type { Song } from "@/features/songs/types";

export const SONGS: Song[] = [
  {
    id: "s1",
    slug: "falcons",
    title: "Falcons",
    artist: {
      id: "a1",
      slug: "g-herbo",
      name: "G Herbo",
      avatarUrl: "/Charlie Wilson.avif",
    },
    audioUrl: "/testsong.mp3",
    coverUrl: "/mock/covers/falcons.jpg",
    stats: { views: 1500, likes: 300, ranking: 0 },
    hasLyrics: true,
    sources: [
      { platform: "youtube", url: "https://youtube.com/watch?v=xxxx" },
      { platform: "audiomack", url: "https://audiomack.com/track/xxxx" },
    ],
    releasedAt: "2024-05-20",
    durationSec: 182,
  },
  {
    id: "s2",
    slug: "trenches",
    title: "Trenches",
    artist: {
      id: "a1",
      slug: "g-herbo",
      name: "G Herbo",
      avatarUrl: "/Charlie Wilson.avif",
    },
    audioUrl: "/testsong.mp3",
    stats: { views: 1100, likes: 220, ranking: 0 },
    hasLyrics: false,
    sources: [{ platform: "youtube", url: "https://youtube.com/watch?v=yyyy" }],
    releasedAt: "2024-07-11",
    durationSec: 205,
  },
  {
    id: "s3",
    slug: "rowdy-anthem",
    title: "Rowdy Anthem",
    artist: {
      id: "a2",
      slug: "rowdy-rebel",
      name: "Rowdy Rebel",
      avatarUrl: "/Charlie Wilson.avif",
    },
    audioUrl: "/testsong.mp3",
    stats: { views: 1200, likes: 250, ranking: 0 },
    hasLyrics: true,
    sources: [
      { platform: "soundcloud", url: "https://soundcloud.com/track/zzzz" },
    ],
    releasedAt: "2024-03-02",
    durationSec: 198,
  },
];

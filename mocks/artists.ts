import { RankingRowProps } from "@/features/ranking/types";

export const mockRankingRows: RankingRowProps[] = [
  {
    rank: 1,
    artistsName: "G Herbo",
    artistsImagePath: "/Charlie Wilson.avif",
    songName: "Falcons",
    songPath: "/testsong.mp3",
    views: 1500,
    hearts: 300,
    isHearted: true,
  },
  {
    rank: 2,
    artistsName: "G Herbo",
    artistsImagePath: "/Charlie Wilson.avif",
    songName: "Rowdy Rebel",
    songPath: "/testsong.mp3",
    views: 1200,
    hearts: 250,
    isHearted: false,
  },
];

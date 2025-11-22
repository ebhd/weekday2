import {
  getRankingRows,
  getTopArtistsRanking,
} from "@/features/ranking/server";
import { RankingHomeSectionClient } from "@/features/marketing/components/ranking-home/RankingHomeSectionClient";

export async function RankingHomeSection() {
  const [songRows, artistRows] = await Promise.all([
    getRankingRows(),
    getTopArtistsRanking(10),
  ]);

  return (
    <RankingHomeSectionClient songRows={songRows} artistRows={artistRows} />
  );
}

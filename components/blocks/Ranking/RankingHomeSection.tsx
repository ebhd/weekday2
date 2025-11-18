import { getRankingRows, getTopArtistsRanking } from "@/features/ranking/api";
import { RankingHomeSectionClient } from "./RankingHomeSectionClient";

export async function RankingHomeSection() {
  const [songRows, artistRows] = await Promise.all([
    getRankingRows(),
    getTopArtistsRanking(10), 
  ]);

  return (
    <RankingHomeSectionClient songRows={songRows} artistRows={artistRows} />
  );
}

import type { DatasetItem } from "./types";
import { mockRankingRows } from "@/mocks/artists";

export async function getLocalDataset(): Promise<DatasetItem[]> {
  return mockRankingRows;
}

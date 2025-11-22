import SearchScreen from "@/features/search/components/SearchScreen";
import { getLocalDataset } from "@/features/search/server";

export default async function Page() {
  const dataset = await getLocalDataset();
  return <SearchScreen dataset={dataset} />;
}

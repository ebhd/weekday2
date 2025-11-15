import SearchScreen from "@/features/search/components/SearchScreen";
import { getLocalDataset } from "@/features/search/api";

export default async function Page() {
  const dataset = await getLocalDataset();
  return <SearchScreen dataset={dataset} />;
}

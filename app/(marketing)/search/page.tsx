import { SearchScreen, getLocalDataset } from "@/features/search";

export default async function Page() {
  const dataset = await getLocalDataset();
  return <SearchScreen dataset={dataset} />;
}

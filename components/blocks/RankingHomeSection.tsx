import { TestBar } from "./TextBar";
import { RankingTable } from "../../features/ranking/components/RankingTable";
import { ArtistCard } from "@/features/artists/components/ArtistCards";

export function RankingHomeSection() {
  return (
    <section className="flex flex-col items-center gap-6">
      <TestBar
        text="Explore top rated artists and viewed songs on our Platform And Worldwide"
        icon={true}
      />

      <div className="w-full lg:hidden">
        <RankingTable />
      </div>

      <div className="hidden lg:grid lg:w-full lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:grid-rows-2 lg:gap-6">
        <div className="flex justify-end">
          <ArtistCard />
        </div>

        <div className="row-span-2">
          <RankingTable />
        </div>

        <div className="flex justify-start">
          <ArtistCard />
        </div>

        <div className="flex justify-end">
          <ArtistCard />
        </div>

        <div className="flex justify-start col-start-3 row-start-2">
          <ArtistCard />
        </div>
      </div>
    </section>
  );
}

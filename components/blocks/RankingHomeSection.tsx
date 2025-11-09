import { TestBar } from "./TextBar";
import { RankingTable } from "../../features/ranking/components/RankingTable";
export function RankingHomeSection() {
  return (
    <div className="justify-center flex flex-col items-center gap-4">
      <TestBar
        text="Explore top rated and viewed artists on our Platform And Worldwide"
        icon={true}
      />
      <RankingTable />
      <button className="w-full h-10 border border-muted-fg rounded-xl flex items-center justify-center font-sans">
        <p>Load more</p>
      </button>
    </div>
  );
}

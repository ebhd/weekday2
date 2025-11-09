import { TestBar } from "./TextBar";
import { RankingTable } from "../../features/ranking/components/RankingTable";
export function RankingHomeSection() {
  return (
    <div className="justify-center flex flex-col items-center gap-4">
      <TestBar
        text="Explore top rated and viewed artists on our Platform And Worldwide"
        width={32}
        icon={true}
      />
      <RankingTable />
    </div>
  );
}

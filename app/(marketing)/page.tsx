import { Hero } from "@/components/core/Hero";
import { RankingTable } from "@/features/ranking/components/RankingTable";
export default function Home() {
  return (
    <>
      <Hero />
      <div className="flex justify-center">
        {" "}
        <RankingTable />{" "}
      </div>
    </>
  );
}

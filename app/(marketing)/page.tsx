import { Hero } from "@/components/blocks/Hero";
import { RankingHomeSection } from "@/components/core/Ranking.tsx/RankingHomeSection";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="flex justify-center">
        <RankingHomeSection />
      </div>
    </>
  );
}

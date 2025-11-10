import { Hero } from "@/components/core/Hero";
import { RankingHomeSection } from "@/components/blocks/RankingHomeSection";

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

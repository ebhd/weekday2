import { Hero } from "@/components/blocks/Hero";
import { RankingHomeSection } from "@/components/blocks/Ranking/RankingHomeSection";
import { Offers } from "@/components/blocks/Offers";
export default function Home() {
  return (
    <>
      <Hero />
      
        <div className="flex justify-center">
          <RankingHomeSection />
        </div>
        <Offers />
     
    </>
  );
}

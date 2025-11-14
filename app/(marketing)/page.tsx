import { Hero } from "@/components/blocks/Hero";
import { RankingHomeSection } from "@/components/blocks/Ranking/RankingHomeSection";
import { Offers } from "@/components/blocks/Offers";
import { Faq } from "@/components/blocks/Faq";
export default function Home() {
  return (
    <>
      <div className="md:px-48 px-4">
        <Hero />

        <div className="flex justify-center">
          <RankingHomeSection />
        </div>
        <Offers />
      </div>
      <Faq />
    </>
  );
}

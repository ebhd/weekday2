// app/(marketing)/page.tsx

import { Hero } from "@/features/marketing/Hero";
import { RankingHomeSection } from "@/features/marketing/components/ranking-home/RankingHomeSection";
import { Offers } from "@/features/marketing/Offers";
import { Faq } from "@/features/marketing/Faq";
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

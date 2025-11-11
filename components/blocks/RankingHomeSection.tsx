"use client";

import { useEffect, useRef, useState } from "react";
import { TestBar } from "./TextBar";
import { RankingTable } from "../../features/ranking/components/RankingTable";
import { ArtistCard } from "@/features/artists/components/ArtistCards";
import { mockRankingRows } from "@/mocks/artists";

export function RankingHomeSection() {
  const [visibleCount, setVisibleCount] = useState(4);

  const visibleRows = mockRankingRows.slice(0, visibleCount);
  const hasMore = visibleCount < mockRankingRows.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, mockRankingRows.length));
  };

  const tableRef = useRef<HTMLDivElement | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);

  const [maxSideCards, setMaxSideCards] = useState(4);

  useEffect(() => {
    if (!tableRef.current || !firstCardRef.current) return;

    const tableHeight = tableRef.current.offsetHeight;
    const cardHeight = firstCardRef.current.offsetHeight;

    const CARD_GAP_PX = 24;
    const effectiveCardHeight = cardHeight + CARD_GAP_PX;

    if (tableHeight > 0 && effectiveCardHeight > 0) {
      const maxCardsPerColumn = Math.max(
        1,
        Math.floor((tableHeight + CARD_GAP_PX) / effectiveCardHeight)
      );

      setMaxSideCards(maxCardsPerColumn * 2);
    }
  }, [visibleRows.length]);

  const sideArtists = visibleRows.slice(0, maxSideCards);

  const leftArtists = sideArtists.filter((row) => row.rank % 2 === 1);
  const rightArtists = sideArtists.filter((row) => row.rank % 2 === 0);

  return (
    <section className="flex flex-col items-center gap-6">
      <TestBar
        text="Explore top rated artists and viewed songs on our Platform And Worldwide"
        icon={true}
      />

 
      <div className="w-full lg:hidden">
        <RankingTable
          rows={visibleRows}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      </div>

      <div className="hidden lg:grid lg:w-full lg:grid-cols-[12rem_minmax(0,1fr)_12rem] lg:gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          {leftArtists.map((row, index) => (
            <div key={row.rank} ref={index === 0 ? firstCardRef : undefined}>
              <ArtistCard
                rank={row.rank}
                name={row.artistsName}
                imagePath={row.artistsImagePath ?? "/Charlie Wilson.avif"}
                views={row.views}
                hearts={row.hearts}
              />
            </div>
          ))}
        </div>

        {/* CENTER Table */}
        <div ref={tableRef}>
          <RankingTable
            rows={visibleRows}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {rightArtists.map((row) => (
            <ArtistCard
              key={row.rank}
              rank={row.rank}
              name={row.artistsName}
              imagePath={row.artistsImagePath ?? "/Charlie Wilson.avif"}
              views={row.views}
              hearts={row.hearts}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

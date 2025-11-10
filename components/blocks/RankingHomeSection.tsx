"use client";

import { useState } from "react";
import { TestBar } from "./TextBar";
import { RankingTable } from "../../features/ranking/components/RankingTable";
import { ArtistCard } from "@/features/artists/components/ArtistCards";
import { mockRankingRows } from "@/mocks/artists";

export function RankingHomeSection() {
  const [visibleCount, setVisibleCount] = useState(5);

  const visibleRows = mockRankingRows.slice(0, visibleCount);
  const hasMore = visibleCount < mockRankingRows.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, mockRankingRows.length));
  };

  // Split artists: odd ranks on the left, even on the right
  const leftArtists = visibleRows.filter((row) => row.rank % 2 === 1);
  const rightArtists = visibleRows.filter((row) => row.rank % 2 === 0);

  return (
    <section className="flex flex-col items-center gap-6">
      <TestBar
        text="Explore top rated artists and viewed songs on our Platform And Worldwide"
        icon={true}
      />

      {/* Mobile: just the table */}
      <div className="w-full lg:hidden">
        <RankingTable
          rows={visibleRows}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      </div>

      {/* Desktop: cards + table */}
      <div className="hidden lg:grid lg:w-full lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6">
        {/* LEFT COLUMN – odd ranks */}
        <div className="flex flex-col gap-6">
          {leftArtists.map((row) => (
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

        {/* CENTER – table */}
        <div>
          <RankingTable
            rows={visibleRows}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </div>

        {/* RIGHT COLUMN – even ranks */}
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

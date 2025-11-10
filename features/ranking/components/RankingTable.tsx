"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpToLine } from "@fortawesome/free-solid-svg-icons";
import { RankingRow } from "./RankingTableParts/RankingRow";
import { mockRankingRows } from "@/mocks/artists";
import { useState } from "react";

export const rankingDesktopGrid =
  "lg:grid lg:grid-cols-[60px_1.5fr_2fr_0.5fr] lg:items-center lg:gap-x-8";

export const rankingMobileGrid =
  "grid grid-cols-[90px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)] items-center gap-x-4";

export function RankingTable() {
  const [visibleCount, setVisibleCount] = useState(5);
  const visibleRows = mockRankingRows.slice(0, visibleCount);

  return (
    <div>
      <div className="rounded-2xl text-white bg-linear-to-b from-accent/40 to-secondary/30 border border-muted-fg backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden font-sans ">
        {/* HEADER */}
        <div
          className={`${rankingDesktopGrid} ${rankingMobileGrid} px-4 lg:px-8 py-4 text-sm text-white/60 bg-black/20`}
        >
          <div className="text-center font-normal">
            Rank <FontAwesomeIcon icon={faArrowsUpToLine} />
          </div>
          <div className="text-center font-normal">Name</div>
          <div className="text-center font-normal ">Song</div>
          <div className="text-center font-normal">Stats</div>
        </div>

        {/* BODY */}
        <div className="divide-y divide-white/10">
          {visibleRows.map((row) => (
            <RankingRow key={row.rank} {...row} />
          ))}
        </div>
      </div>

      {/* LOAD MORE */}
      {visibleCount < mockRankingRows.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 3)}
          className="w-full h-10 border border-muted-fg rounded-xl flex items-center justify-center font-sans mt-3 hover:bg-white/5 transition"
        >
          <p>Load more</p>
        </button>
      )}
    </div>
  );
}

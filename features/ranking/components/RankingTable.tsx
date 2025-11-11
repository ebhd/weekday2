"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpToLine } from "@fortawesome/free-solid-svg-icons";
import { RankingRow } from "./RankingTableParts/RankingRow";

import type { RankingRowProps } from "@/features/ranking/types";

export const rankingDesktopGrid =
  "lg:grid lg:grid-cols-[60px_1.5fr_2fr_0.5fr] lg:items-center lg:gap-x-8";

export const rankingMobileGrid =
  "grid grid-cols-[90px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)] items-center gap-x-4";

type RankingTableProps = {
  rows: RankingRowProps[];
  hasMore: boolean;
  onLoadMore: () => void;
};

export function RankingTable({ rows, hasMore, onLoadMore }: RankingTableProps) {
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
          {rows.map((row) => (
            <RankingRow key={row.rank} {...row} />
          ))}
        </div>
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          className="w-full h-10 border border-muted-fg rounded-xl flex items-center justify-center font-sans mt-3 hover:bg-white/5 transition shadow-lg shadow-white/50"
        >
          <p>Load more</p>
        </button>
      )}
    </div>
  );
}

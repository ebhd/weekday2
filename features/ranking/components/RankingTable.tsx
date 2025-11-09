import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsUpToLine,
  faEye,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { SongPlayer } from "./SongPlayer";
import { RankingRow } from "./RankingRow";
import { SkeletonRow } from "./SkeletonRow";
import { mockRankingRows } from "@/mocks/artists";

export function RankingTable() {
  const grid =
    "grid grid-cols-[80px_minmax(0,1.5fr)_minmax(0,2fr)_160px] items-center";

  return (
    <div className="rounded-2xl text-white bg-linear-to-b from-accent/40 to-secondary/30 border border-muted-fg backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden font-sans ">
      {/* HEADER */}
      <div
        className={`${grid} px-4 lg:px-8 py-4 text-sm text-white/60 bg-black/20`}
      >
        <div className="text-center font-normal">
          Rank <FontAwesomeIcon icon={faArrowsUpToLine} />
        </div>

        <div className="text-center font-normal">
          Name <FontAwesomeIcon icon={faArrowsUpToLine} />
        </div>

        <div className="text-center font-normal">
          Song <FontAwesomeIcon icon={faArrowsUpToLine} />
        </div>

        <div className="text-center font-normal">
          Stats <FontAwesomeIcon icon={faArrowsUpToLine} />
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-white/10">
        {mockRankingRows.map((row) => (
          <RankingRow key={row.rank} {...row} />
        ))}

        <SkeletonRow />
      </div>
    </div>
  );
}

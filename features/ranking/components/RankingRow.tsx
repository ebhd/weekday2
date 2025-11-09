import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SongPlayer } from "./SongPlayer";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { RankingRowProps } from "../types";
import Image from "next/image";

export function RankingRow(props: RankingRowProps) {
  const grid =
    "grid grid-cols-[80px_minmax(0,1.5fr)_minmax(0,1fr)_auto] items-center";

  return (
    <div
      className={`
        ${grid} px-4 py-2 items-center
        lg:grid
        grid-cols-1 lg:grid-cols-[80px_minmax(0,1.5fr)_minmax(0,2fr)_auto]
        gap-y-3 lg:gap-y-0
        border-b border-white/10
      `}
    >
      {/* Rank */}
      <div className="text-center font-display text-4xl lg:text-5xl">
        {props.rank}.
      </div>

      {/* Name column */}
      <div className="flex flex-row lg:flex-row items-center gap-3 justify-start w-full lg:pl-20 text-center lg:text-left">
        <Image
          src={props.artistsImagePath || "/default-avatar.png"}
          alt={props.artistsName}
          width={64}
          height={64}
          className="rounded-full object-cover shrink-0 w-14 h-14 lg:w-16 lg:h-16 lg:block hidden"
        />
        <div className="flex flex-col min-w-0">
          <span className="truncate text-base lg:text-lg">
            {props.songName}
          </span>
          <span className="text-sm text-white/60 truncate text-left">
            {props.artistsName}
          </span>
        </div>
      </div>

      {/* Song Player */}
      <div className="w-full max-w-full justify-center lg:max-w-[380px]">
        <SongPlayer />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-end gap-3">
        {/* small stacked stats */}
        <div className="flex flex-col gap-1 text-white/60 text-xs text-left">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faEye} />
            <span>{props.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faHeart} />
            <span>{props.hearts}</span>
          </div>
        </div>

        {/* big red heart */}
        <FontAwesomeIcon
          icon={faHeart}
          className="text-red-500 text-2xl drop-shadow-[0_0_6px_rgba(255,80,80,0.6)]"
        />
      </div>
    </div>
  );
}

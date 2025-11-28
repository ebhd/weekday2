import Image from "next/image";
import Link from "next/link";
import { SongPlayer } from "./SongPlayer";
import { RankingStat } from "./RankingStat";

import type { RankingRowProps } from "../../types";
import { rankingDesktopGrid, rankingMobileGrid } from "../RankingTable";

type Props = RankingRowProps & {
  onToggleHeart?: (songId: string) => void;
  onPlayProgress?: (songId: string, secondsPlayed: number) => void;
};

export function RankingRow(props: Props) {
  return (
    <div
      className={`
        ${rankingDesktopGrid} ${rankingMobileGrid} px-4 py-2
        gap-y-3 md:gap-y-0
        border-b border-white/10
      `}
    >
      <div className="text-center font-display text-4xl md:text-5xl">
        {props.rank}.
      </div>

      <div className="flex items-center gap-3 justify-start w-full md:pl-20 min-w-0">
        <Image
          src={props.artistImageUrl || "/default-avatar.png"}
          alt={props.artistName}
          width={64}
          height={64}
          className="rounded-full object-cover shrink-0 w-14 h-14 md:w-16 md:h-16 md:block hidden"
        />
        <div className="flex flex-col min-w-0">
          <Link href={`/songs/${props.songSlug}`}>
            <span className="text-base truncate md:text-md hover:underline">
              {props.songTitle}
            </span>
          </Link>
          <Link href={`/artists/${props.artistSlug}`}>
            <span className="text-sm text-white/60 truncate hover:underline">
              {props.artistName}
            </span>
          </Link>
        </div>
      </div>

      <div className="w-full max-w-full min-w-0 justify-center lg:max-w-[380px]">
        <SongPlayer
          url={props.audioUrl}
          onPlayProgress={
            props.onPlayProgress
              ? (seconds) => props.onPlayProgress?.(props.songId, seconds)
              : undefined
          }
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <RankingStat
          songId={props.songId}
          views={props.views}
          hearts={props.hearts}
          isHearted={props.isHearted}
          onToggleHeart={props.onToggleHeart}
        />
      </div>
    </div>
  );
}

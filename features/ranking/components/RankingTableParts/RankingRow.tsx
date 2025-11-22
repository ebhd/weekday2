import Image from "next/image";
import Link from "next/link";
import { SongPlayer } from "./SongPlayer";
import { RankingStat } from "./RankingStat";

import type { RankingRowProps } from "../../types";
import { rankingDesktopGrid, rankingMobileGrid } from "../RankingTable";

type Props = RankingRowProps & {
  onToggleHeart?: (songId: string) => void;
};

export function RankingRow(props: Props) {
  return (
    <div
      className={`
        ${rankingDesktopGrid} ${rankingMobileGrid} px-4 py-2
        gap-y-3 lg:gap-y-0
        border-b border-white/10
      `}
    >
      <div className="text-center font-display text-4xl lg:text-5xl">
        {props.rank}.
      </div>

      <div className="flex items-center gap-3 justify-start w-full lg:pl-20 min-w-0">
        <Image
          src={props.artistImageUrl || "/default-avatar.png"}
          alt={props.artistName}
          width={64}
          height={64}
          className="rounded-full object-cover shrink-0 w-14 h-14 lg:w-16 lg:h-16 lg:block hidden"
        />
        <div className="flex flex-col min-w-0">
          <Link href={`/songs/${props.songSlug}`}>
            <span className="text-base truncate lg:text-lg hover:underline">
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

      <div className="w-full max-w-full justify-center lg:max-w-[380px]">
        <SongPlayer url={props.audioUrl} />
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

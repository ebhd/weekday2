import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SongPlayer } from "./SongPlayer";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";

export function RankingRow() {
  const grid =
    "grid grid-cols-[80px_minmax(0,1.5fr)_minmax(0,2fr)_160px] items-center";
  return (
    <div className={`${grid} px-8 py-4 items-center`}>
      <div className="text-center font-display text-5xl">1.</div>
      <div className="text-center">Malcolm Lockyer</div>
      <div className="max-w-[380px] w-full">
        <SongPlayer />
      </div>
      <div className="flex justify-center items-center gap-4">
        <div className="flex flex-col items-center gap-2 text-white/60 text-xs">
          <FontAwesomeIcon icon={faEye} />
          <FontAwesomeIcon icon={faHeart} />
        </div>

        <div className="flex items-center gap-2 text-lg">
          <FontAwesomeIcon
            icon={faHeart}
            className="text-red-500 text-2xl drop-shadow-[0_0_6px_rgba(255,80,80,0.6)]"
          />
          <span className="font-medium tracking-tight">11</span>
        </div>
      </div>
    </div>
  );
}

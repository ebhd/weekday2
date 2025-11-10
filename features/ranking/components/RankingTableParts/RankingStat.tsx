"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { RankingStats } from "../../types";
import { useState } from "react";

export function RankingStat(props: RankingStats) {
  const [isHearted, setIsHearted] = useState(props.isHearted);
  console.log("isHearted:", isHearted);
  return (
    <>
      <div className="flex flex-col gap-1 text-white/60 text-xs text-left">
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faEye} />
          <span>{props.views}</span>
        </div>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faHeartSolid} />
          <span>{props.hearts}</span>
        </div>
      </div>

      <button onClick={() => setIsHearted(!isHearted)}>
        {isHearted ? (
          <FontAwesomeIcon
            icon={faHeartSolid}
            className="text-red-500 text-2xl drop-shadow-[0_0_6px_rgba(255,80,80,0.6)] transition-all hover:scale-110"
          />
        ) : (
          <FontAwesomeIcon
            icon={faHeartRegular}
            className="text-white/50 text-2xl transition-all hover:scale-110"
          />
        )}
      </button>
    </>
  );
}

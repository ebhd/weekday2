"use client";

import WavesurferPlayer from "@wavesurfer/react";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

type SongPlayerProps = {
  url?: string | null;

  height?: number;
};

export function SongPlayer({ url, height = 80 }: SongPlayerProps) {
  const [wavesurfer, setWavesurfer] = React.useState<any | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    setIsPlaying(false);
  }, [url]);

  const onReady = React.useCallback((ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  }, []);

  const onPlayPause = React.useCallback(() => {
    if (!wavesurfer) return;
    wavesurfer.playPause();
  }, [wavesurfer]);

  const disabled = !url;

  return (
    <div className="flex items-center space-x-2 w-full">
      {/* Play / Pause button */}
      <button
        onClick={onPlayPause}
        disabled={disabled}
        className={[
          "h-9 w-9 flex items-center justify-center rounded-full transition",
          disabled
            ? "bg-white/5 text-white/30 cursor-not-allowed"
            : "bg-white/10 hover:bg-white/20 text-white",
        ].join(" ")}
        aria-label={isPlaying ? "Pause preview" : "Play preview"}
      >
        {isPlaying ? (
          <FontAwesomeIcon icon={faPause} className="text-lg" />
        ) : (
          <FontAwesomeIcon icon={faPlay} className="text-lg" />
        )}
      </button>

      {/* Waveform (desktop only) */}
      <div className="hidden md:block flex-1 max-w-[350px]">
        {url ? (
          <WavesurferPlayer
            /** key forces wavesurfer to rebuild when url changes */
            key={url}
            height={height}
            waveColor="white"
            progressColor="gray"
            barHeight={0.7}
            barGap={1}
            url={url}
            onReady={onReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <div className="text-xs text-white/40 italic">No audio preview</div>
        )}
      </div>
    </div>
  );
}

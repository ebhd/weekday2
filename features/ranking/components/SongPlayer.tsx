"use client";
import WavesurferPlayer from "@wavesurfer/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

export function SongPlayer() {
  const [wavesurfer, setWavesurfer] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    wavesurfer && (wavesurfer as any).playPause();
  };

  return (
    <div className="flex items-center space-x-2 w-full">
      {/* === Play / Pause button — always visible === */}
      <button
        onClick={onPlayPause}
        className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
      >
        {isPlaying ? (
          <FontAwesomeIcon icon={faPause} className="text-white text-lg" />
        ) : (
          <FontAwesomeIcon icon={faPlay} className="text-white text-lg" />
        )}
      </button>

      {/* === Waveform — hidden on mobile, visible on desktop === */}
      <div className="hidden lg:block flex-1 max-w-[350px]">
        <WavesurferPlayer
          height={100}
          waveColor="white"
          barHeight={0.7}
          barGap={1}
          progressColor={"gray"}
          url="/testsong.mp3"
          onReady={onReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}

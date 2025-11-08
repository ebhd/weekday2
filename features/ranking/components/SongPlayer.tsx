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
    <div className="max-w-[380px] w-full space-x-2 flex items-center">
      <button onClick={onPlayPause}>
        {isPlaying ? (
          <FontAwesomeIcon icon={faPause} />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
      </button>
      <WavesurferPlayer
        height={100}
        waveColor="white"
        barHeight={0.7}
        barGap={1}
        width={350}
        progressColor={"gray"}
        url="/testsong.mp3"
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}

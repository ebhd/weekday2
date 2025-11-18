"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faBookOpen,
  faDownload,
  faEye,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import type { Song } from "@/features/songs/types";
import type { Artist } from "@/features/artists/types";
import { SongPlayer } from "@/features/ranking/components/RankingTableParts/SongPlayer";

/* ——— big gradient heart button ——— */
function GradientHeart({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden
      width="56"
      height="56"
      viewBox="0 0 24 24"
      className="drop-shadow-[0_6px_18px_rgba(0,0,0,.35)]"
    >
      <defs>
        <linearGradient id="dr-heart" x1="0" y1="0" x2="1" y2="1">
          {/* green → indigo like your mock */}
          <stop offset="0%" stopColor="#40ff50" />
          <stop offset="100%" stopColor="#4d53d5" />
        </linearGradient>
      </defs>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.98 2 6.41 4.04 4.5 6.6 4.5c1.54 0 3.04.73 4 1.87.96-1.14 2.46-1.87 4-1.87 2.56 0 4.6 1.91 4.6 4.48 0 3.3-3.4 6.38-8.55 11.05L12 21.35z"
        fill={active ? "url(#dr-heart)" : "url(#dr-heart)"}
        opacity={active ? 1 : 0.9}
      />
    </svg>
  );
}

export function SongProfileSection({
  song,
  artists,
}: {
  song: Song;
  artists: Artist[];
}) {
  const [liked, setLiked] = useState(false);

  const primaryArtist = useMemo(
    () =>
      artists.find((a) => a.id === song.artist.id) ??
      artists[0] ?? {
        id: song.artist.id,
        slug: song.artist.slug,
        name: song.artist.name,
        profile: { avatarUrl: song.artist.avatarUrl },
        stats: {
          totalViews: 0,
          totalLikes: 0,
          ranking: 0,
          totalSongs: 0,
          memberSince: "",
        },
      },
    [artists, song]
  );

  return (
    <section
      className="
    max-w-6xl
    mx-4
    lg:mx-auto
    rounded-3xl
    bg-surface/95
    border border-white/10
    shadow-lg shadow-black/20
    px-5 sm:px-8 lg:px-10
    py-6 lg:py-8
    my-12 lg:my-32
  "
    >
      {" "}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <span className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-white/20 shrink-0">
              <Image
                src={primaryArtist.profile?.avatarUrl || "/default-avatar.png"}
                alt={primaryArtist.name}
                fill
                className="object-cover"
              />
            </span>

            <div className="min-w-0">
              <h1 className="font-display text-2xl leading-tight truncate">
                {song.title}
              </h1>
              <Link
                href={`/artists/${primaryArtist.slug}`}
                className="text-white/70 text-sm hover:underline truncate"
              >
                Artist – {primaryArtist.name}
              </Link>
            </div>
          </div>

          <div className="flex-1 lg:min-w-[200px] px-2">
            <SongPlayer />
          </div>

          <button
            onClick={() => setLiked((v) => !v)}
            aria-label="Like song"
            className="shrink-0 rounded-full p-1 hover:scale-[1.02] transition"
          >
            <GradientHeart active={liked} />
          </button>
        </div>

        <div className="pl-[4.5rem] sm:pl-[4.75rem] text-xs text-white/70 flex items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faEye} /> {song.stats.views.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faHeart} />{" "}
            {song.stats.likes.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-black/30 border border-white/10 px-6 py-5 flex items-center gap-5">
          <FontAwesomeIcon icon={faCrown} className="text-3xl" />
          <div>
            <div className="text-[11px] tracking-wide text-white/60">
              RANKING
            </div>
            <div className="text-lg font-semibold">#{song.stats.ranking}</div>
          </div>
        </div>

        <Link
          href={song.hasLyrics ? "#lyrics" : "#"}
          className="rounded-2xl bg-black/30 border border-white/10 px-6 py-5 flex items-center gap-5 hover:bg-white/[0.06] transition"
        >
          <FontAwesomeIcon icon={faBookOpen} className="text-3xl" />
          <div>
            <div className="text-lg font-semibold">Lyrics</div>
            {!song.hasLyrics && (
              <div className="text-[11px] text-white/50">No lyrics yet</div>
            )}
          </div>
        </Link>

        <a
          href={song.audioUrl}
          download
          className="rounded-2xl bg-black/30 border border-white/10 px-6 py-5 flex items-center gap-5 hover:bg-white/[0.06] transition"
        >
          <FontAwesomeIcon icon={faDownload} className="text-3xl" />
          <div className="text-lg font-semibold">Download</div>
        </a>
      </div>
    </section>
  );
}

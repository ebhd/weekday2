// features/songs/components/SongProfileSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faBookOpen,
  faDownload,
  faEye,
  faHeart,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

import type { Song, SongArtistPreview } from "@/features/songs/types";
import { SongPlayer } from "@/features/ranking/components/RankingTableParts/SongPlayer";
import { useAuthStore } from "@/features/auth/store";
import { useSongReactions } from "@/features/reactions/hooks/useSongReactions";
import type {
  ReactionType,
  ReactionResponse,
} from "@/features/reactions/types";
import { reportSongPlay } from "@/features/songs/client/plays";

const hasOwn = (obj: object, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key);

export function SongProfileSection({
  song,
  artists,
}: {
  song: Song;
  artists: SongArtistPreview[];
}) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();

  const reactionsMap = useSongReactions([song.id]);

  const [serverHearts, setServerHearts] = useState(song.stats.likes ?? 0);
  const [serverDislikes, setServerDislikes] = useState(0);

  const [views, setViews] = useState(song.stats.views ?? 0);
  const [playReported, setPlayReported] = useState(false);

  const [optimistic, setOptimistic] = useState<
    Record<string, ReactionType | null | undefined>
  >({});

  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    setOptimistic({});
  }, [user?.id]);

  const dbReaction = reactionsMap[song.id] ?? null;

  const effectiveReaction: ReactionType | null = hasOwn(optimistic, song.id)
    ? optimistic[song.id] ?? null
    : dbReaction;

  const dbLiked = dbReaction === "like";
  const effectiveLiked = effectiveReaction === "like";

  const displayedHearts =
    (serverHearts ?? 0) + (effectiveLiked ? 1 : 0) - (dbLiked ? 1 : 0);

  async function toggleHeart() {
    if (isMutating) return;

    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }

    const prev = effectiveReaction;
    const next: ReactionType | null = prev === "like" ? null : "like";

    setOptimistic((m) => ({ ...m, [song.id]: next }));
    setIsMutating(true);

    try {
      const res = await fetch(`/api/reactions/song/${song.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reaction: "like" }),
      });

      const data: ReactionResponse = await res.json();
      if (!res.ok) throw new Error((data as any)?.error ?? "Failed to react");

      setServerHearts(data.likeCount ?? serverHearts);
      setServerDislikes(data.dislikeCount ?? serverDislikes);

      setOptimistic((m) => ({
        ...m,
        [song.id]: data.userReaction ?? null,
      }));
    } catch (e) {
      console.error("toggleHeart error", e);
      setOptimistic((m) => ({ ...m, [song.id]: prev }));
    } finally {
      setIsMutating(false);
    }
  }

  const primaryArtist = useMemo(() => {
    return (
      artists.find((a) => a.id === song.artist.id) ?? artists[0] ?? song.artist
    );
  }, [artists, song.artist]);

  async function handlePlayProgress(secondsPlayed: number) {
    const THRESHOLD_SECONDS = 10;

    if (playReported) return;
    if (secondsPlayed < THRESHOLD_SECONDS) return;

    setPlayReported(true);

    const newCount = await reportSongPlay(song.id);
    if (typeof newCount === "number") {
      setViews(newCount);
    } else {
      console.warn("Play report failed, keeping local state");
    }
  }

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
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <span className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-white/20 shrink-0">
              <Image
                src={primaryArtist.avatarUrl || "/default-avatar.png"}
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
            {/* 👇 pass playback progress callback */}
            <SongPlayer
              url={song.audioUrl}
              onPlayProgress={handlePlayProgress}
            />
          </div>

          <button
            onClick={toggleHeart}
            aria-label={effectiveLiked ? "Unlike song" : "Like song"}
            disabled={isMutating}
            className="shrink-0 p-2 transition disabled:opacity-60"
          >
            {effectiveLiked ? (
              <FontAwesomeIcon
                icon={faHeartSolid}
                className="text-red-500 text-3xl drop-shadow-[0_0_6px_rgba(255,80,80,0.6)] transition-all hover:scale-110"
              />
            ) : (
              <FontAwesomeIcon
                icon={faHeartRegular}
                className="text-white/50 text-3xl transition-all hover:scale-110"
              />
            )}
          </button>
        </div>

        <div className="pl-[4.5rem] sm:pl-[4.75rem] text-xs text-white/70 flex items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faEye} /> {views.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faHeart} />{" "}
            {Math.max(0, displayedHearts).toLocaleString()}
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
            <div className="text-lg font-semibold">
              #{song.stats.ranking ?? 0}
            </div>
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

        {song.isDownloadable ? (
          <a
            href={song.audioUrl}
            download
            className="rounded-2xl bg-black/30 border border-white/10 px-6 py-5 flex items-center gap-5 hover:bg-white/[0.06] transition"
          >
            <FontAwesomeIcon icon={faDownload} className="text-3xl" />
            <div className="text-lg font-semibold">Download</div>
          </a>
        ) : (
          <div className="rounded-2xl bg-black/20 border border-white/10 px-6 py-5 flex items-center gap-5 opacity-70 cursor-not-allowed">
            <FontAwesomeIcon icon={faDownload} className="text-3xl" />
            <div>
              <div className="text-lg font-semibold">Download</div>
              <div className="text-[11px] text-white/50">
                Download disabled by the artist
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

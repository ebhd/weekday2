"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { TextBar } from "@/components/core/TextBar";
import { RankingTable } from "@/features/ranking/components/RankingTable";
import { ArtistCard } from "@/features/artists/components/ArtistCard";
import { useSideCardCapacity } from "@/features/marketing/components/ranking-home/useSideCardCapacity";
import { useSongReactions } from "@/features/reactions/hooks/useSongReactions";
import { useAuthStore } from "@/features/auth/store";

import type {
  RankingRowProps,
  ArtistRankingRow,
} from "@/features/ranking/types";
import type {
  ReactionType,
  ReactionResponse,
} from "@/features/reactions/types";

type Props = {
  songRows: RankingRowProps[];
  artistRows: ArtistRankingRow[];
};

const hasOwn = (obj: object, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key);

export function RankingHomeSectionClient({ songRows, artistRows }: Props) {
  const [visibleCount, setVisibleCount] = useState(5);

  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const totalSongs = songRows.length;
  const visibleRows = songRows.slice(0, visibleCount);
  const hasMore = visibleCount < totalSongs;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, totalSongs));
  };

  // ---------------------------
  // Fetch current user reactions for visible songs only
  // ---------------------------
  const visibleSongIds = useMemo(
    () => visibleRows.map((r) => r.songId),
    [visibleRows]
  );
  const reactionsMap = useSongReactions(visibleSongIds);

  // ---------------------------
  // Optimistic override map
  // (IMPORTANT: null must be respected; don't use ??)
  // ---------------------------
  const [optimistic, setOptimistic] = useState<
    Record<string, ReactionType | null | undefined>
  >({});

  // If user changes (logout/login), reset optimistic state
  useEffect(() => {
    setOptimistic({});
  }, [user?.id]);

  const effectiveReactionFor = (songId: string) =>
    hasOwn(optimistic, songId)
      ? optimistic[songId] ?? null
      : reactionsMap[songId] ?? null;

  async function toggleHeart(songId: string) {
    // 1) Not logged in -> redirect to login
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }

    const prev = effectiveReactionFor(songId);
    const next: ReactionType | null = prev === "like" ? null : "like";

    // 2) optimistic UI
    setOptimistic((m) => ({ ...m, [songId]: next }));

    try {
      const res = await fetch(`/api/reactions/song/${songId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reaction: "like" }),
      });

      const data: ReactionResponse = await res.json();
      if (!res.ok) throw new Error((data as any)?.error ?? "Failed to react");

      // 3) Sync optimistic to DB truth (can be null!)
      setOptimistic((m) => ({
        ...m,
        [songId]: data.userReaction ?? null,
      }));
    } catch (e) {
      console.error("toggleHeart error", e);
      // rollback
      setOptimistic((m) => ({ ...m, [songId]: prev }));
    }
  }

  // ---------------------------
  // Enrich visible ranking rows with effective isHearted + displayed count
  // ---------------------------
  const visibleRowsEnriched = useMemo<RankingRowProps[]>(() => {
    return visibleRows.map((row) => {
      const dbReaction = reactionsMap[row.songId] ?? null;
      const effective = effectiveReactionFor(row.songId);

      const dbLiked = dbReaction === "like";
      const effectiveLiked = effective === "like";

      const baseHearts = typeof row.hearts === "number" ? row.hearts : 0;

      // Instant UI count adjustment:
      // If DB had your like included and you unliked => -1.
      // If DB didn't have your like and you liked => +1.
      const displayedHearts =
        baseHearts + (effectiveLiked ? 1 : 0) - (dbLiked ? 1 : 0);

      return {
        ...row,
        isHearted: effectiveLiked,
        hearts: Math.max(0, displayedHearts),
      };
    });
  }, [visibleRows, reactionsMap, optimistic]);

  // ---------------------------
  // Side cards layout calc (your existing logic)
  // ---------------------------
  const tableRef = useRef<HTMLDivElement | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);

  const maxSideCards = useSideCardCapacity(
    tableRef,
    firstCardRef,
    visibleRowsEnriched.length
  );

  const sideArtists = artistRows.slice(0, maxSideCards);
  const leftArtists = sideArtists.filter((row) => row.rank % 2 === 1);
  const rightArtists = sideArtists.filter((row) => row.rank % 2 === 0);

  return (
    <section className="flex flex-col items-center gap-6">
      <TextBar
        text="Explore top rated artists and viewed songs on our Platform And Worldwide"
        icon
      />

      {/* Mobile */}
      <div className="w-full lg:hidden">
        <RankingTable
          rows={visibleRowsEnriched}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onToggleHeart={toggleHeart}
        />
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid lg:w-full lg:grid-cols-[12rem_minmax(0,1fr)_12rem] lg:gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          {leftArtists.map((row, index) => (
            <div
              key={row.artistId}
              ref={index === 0 ? firstCardRef : undefined}
            >
              <ArtistCard
                rank={row.rank}
                name={row.artistName}
                imagePath={row.artistImageUrl ?? "/Charlie Wilson.avif"}
                views={row.totalViews}
                hearts={row.totalHearts}
                link={row.link}
              />
            </div>
          ))}
        </div>

        {/* CENTER */}
        <div ref={tableRef}>
          <RankingTable
            rows={visibleRowsEnriched}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onToggleHeart={toggleHeart}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {rightArtists.map((row) => (
            <ArtistCard
              key={row.artistId}
              rank={row.rank}
              name={row.artistName}
              imagePath={row.artistImageUrl ?? "/Charlie Wilson.avif"}
              views={row.totalViews}
              hearts={row.totalHearts}
              link={row.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

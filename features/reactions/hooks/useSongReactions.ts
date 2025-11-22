"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import type { ReactionType } from "../types";

export function useSongReactions(songIds: string[]) {
  const user = useAuthStore((s) => s.user);
  const [map, setMap] = useState<Record<string, ReactionType | null>>({});

  const idsKey = useMemo(
    () => [...new Set(songIds)].sort().join(","),
    [songIds]
  );

  useEffect(() => {
    if (!user || !idsKey) {
      setMap({});
      return;
    }

    let cancelled = false;

    fetch(`/api/reactions/song?ids=${encodeURIComponent(idsKey)}`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setMap(d.reactions ?? {});
      })
      .catch((e) => {
        console.error("useSongReactions error", e);
        if (!cancelled) setMap({});
      });

    return () => {
      cancelled = true;
    };
  }, [user, idsKey]);

  return map;
}

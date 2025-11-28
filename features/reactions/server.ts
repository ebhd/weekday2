// features/reactions/server.ts
import "server-only";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import type { ReactionType } from "./types";

export async function getUserReactionsForSongs(
  userId: string,
  songIds: string[]
): Promise<Map<string, ReactionType>> {
  const ids = [...new Set(songIds)].filter(
    (id) => z.uuid().safeParse(id).success
  );
  if (!ids.length) return new Map();

  const { data, error } = await supabase
    .from("song_reactions")
    .select("song_id, reaction")
    .eq("user_id", userId)
    .in("song_id", ids);

  if (error) {
    console.error("getUserReactionsForSongs error", error);
    return new Map();
  }

  const map = new Map<string, ReactionType>();
  for (const r of data ?? []) {
    map.set(r.song_id as string, r.reaction as ReactionType);
  }
  return map;
}

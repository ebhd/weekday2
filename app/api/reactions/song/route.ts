import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ reactions: {} });
  }

  const url = new URL(req.url);
  const idsParam = url.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const validIds = ids.filter((id) => z.uuid().safeParse(id).success);
  if (!validIds.length) return NextResponse.json({ reactions: {} });

  const { data, error } = await supabase
    .from("song_reactions")
    .select("song_id, reaction")
    .eq("user_id", user.id)
    .in("song_id", validIds);

  if (error) {
    console.error("reactions GET error", error);
    return NextResponse.json({ reactions: {} });
  }

  const reactions: Record<string, "like" | "dislike"> = {};
  for (const r of data ?? []) {
    reactions[r.song_id as string] = r.reaction as any;
  }

  return NextResponse.json({ reactions });
}

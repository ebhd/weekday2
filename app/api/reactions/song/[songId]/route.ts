// app/api/reactions/song/[songId]/route.ts

import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { supabase } from "@/lib/supabaseClient";
import { zReactionBody } from "@/features/reactions/schemas";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ songId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { songId } = await ctx.params;
  if (!z.uuid().safeParse(songId).success) {
    return NextResponse.json({ error: "Invalid song id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = zReactionBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // ensure target is approved
  const { data: song, error: sErr } = await supabase
    .from("songs")
    .select("id")
    .eq("id", songId)
    .eq("status", "approved")
    .maybeSingle();

  if (sErr || !song) {
    return NextResponse.json({ error: "Song not found" }, { status: 404 });
  }

  const { data, error } = await supabase.rpc("set_song_reaction", {
    p_user_id: user.id,
    p_song_id: songId,
    p_reaction: parsed.data.reaction,
  });

  if (error || !data?.[0]) {
    console.error("set_song_reaction error", error);
    return NextResponse.json({ error: "Failed to react" }, { status: 500 });
  }

  const row = data[0];

  return NextResponse.json({
    songId,
    likeCount: row.like_count,
    dislikeCount: row.dislike_count,
    userReaction: row.user_reaction, // "like" | "dislike" | null
  });
}

// app/api/reactions/song/[songId]/play/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

const zUuid = z.string().uuid();

type Params = { songId: string };

export async function POST(_req: Request, ctx: { params: Promise<Params> }) {
  const { songId } = await ctx.params;

  const parsed = zUuid.safeParse(songId);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid song id" }, { status: 400 });
  }
  const id = parsed.data;

  const { data: song, error: loadErr } = await supabase
    .from("songs")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (loadErr || !song) {
    return NextResponse.json({ error: "Song not found" }, { status: 404 });
  }

  if (song.status !== "approved") {
    return NextResponse.json({ error: "Song is not public" }, { status: 409 });
  }

  const { data: playCount, error: rpcErr } = await supabase.rpc(
    "increment_song_play",
    { p_song_id: id }
  );

  if (rpcErr) {
    console.error("increment_song_play error", rpcErr);
    return NextResponse.json(
      { error: "Failed to track play" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    playCount,
  });
}

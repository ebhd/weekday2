import "server-only";

import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { zUpdateSongBody } from "@/features/my-songs/schemas";
import { getArtistIdForUser, updateMySong } from "@/features/my-songs/server";
import { deleteMySong } from "@/features/my-songs/server";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ songId: string }> }
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const artistId = await getArtistIdForUser(user.id);
  if (!artistId)
    return NextResponse.json({ error: "Artist only" }, { status: 403 });

  const { songId } = await ctx.params;
  if (!z.uuid().safeParse(songId).success) {
    return NextResponse.json({ error: "Invalid song id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = zUpdateSongBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const updated = await updateMySong(artistId, songId, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ song: updated });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ songId: string }> }
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const artistId = await getArtistIdForUser(user.id);
  if (!artistId)
    return NextResponse.json({ error: "Artist only" }, { status: 403 });

  const { songId } = await ctx.params;
  if (!z.uuid().safeParse(songId).success) {
    return NextResponse.json({ error: "Invalid song id" }, { status: 400 });
  }

  const result = await deleteMySong(artistId, songId);

  if (!result.success && result.reason === "NOT_FOUND") {
    return NextResponse.json({ error: "Song not found" }, { status: 404 });
  }
  if (!result.success) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, songId });
}

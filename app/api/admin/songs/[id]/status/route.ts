// app/api/admin/songs/[id]/status/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { zAdminSongStatusBody } from "@/features/admin/schemas";
import { adminGuard } from "../../../../admin/_utils";
import { getCurrentUser } from "@/lib/auth/currentUser";

const zUuid = z.string().trim().uuid();

type Ctx = { params: { id: string } } | { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const guard = await adminGuard();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!guard.ok) return guard.res;

  const params =
    "then" in (ctx.params as any)
      ? await (ctx.params as Promise<any>)
      : ctx.params;

  const rawSongId = params?.id;
  const parsedId = zUuid.safeParse(rawSongId);

  if (!parsedId.success) {
    console.error("Invalid song id param:", rawSongId);
    return NextResponse.json({ error: "Invalid song id" }, { status: 400 });
  }

  const songId = parsedId.data;

  const body = await req.json().catch(() => null);
  const parsedBody = zAdminSongStatusBody.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const status = parsedBody.data.status;

  const { data: song, error: loadErr } = await supabase
    .from("songs")
    .select("id, status")
    .eq("id", songId)
    .maybeSingle();

  if (loadErr || !song) {
    return NextResponse.json({ error: "Song not found" }, { status: 404 });
  }

  if (song.status !== "pending") {
    return NextResponse.json({ error: "Song is not pending" }, { status: 409 });
  }

  const updatePayload: Record<string, any> = { status };

  if (status === "approved") {
    updatePayload.approved_at = new Date().toISOString();
    updatePayload.approved_by = user.id;
  } else {
    updatePayload.approved_at = null;
    updatePayload.approved_by = null;
  }

  const { error: upErr } = await supabase
    .from("songs")
    .update(updatePayload)
    .eq("id", songId);

  if (upErr) {
    console.error("admin approve/reject error", upErr);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, songId, status });
}

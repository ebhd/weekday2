// drillrecord/app/api/admin/songs/[id]/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "../../_utils";
import { supabase } from "@/lib/supabaseClient";

const zPatchSong = z.object({
  title: z.string().min(1).max(80).optional(),
  status: z.enum(["pending", "approved", "rejected", "disabled"]).optional(),
  is_downloadable: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard("full");
  if (!guard.ok) return guard.res;

  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = zPatchSong.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("songs")
    .update(parsed.data)
    .eq("id", id)
    .select(
      "id, slug, title, status, play_count, like_count, score, created_at, is_downloadable"
    )
    .maybeSingle();

  if (error || !data) {
    console.error("admin songs PATCH error", error);
    return NextResponse.json(
      { error: "Failed to update song" },
      { status: 500 }
    );
  }

  return NextResponse.json({ song: data });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const guard = await adminGuard("full");
  if (!guard.ok) return guard.res;

  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const { error } = await supabase.from("songs").delete().eq("id", id);

  if (error) {
    console.error("admin songs DELETE error", error);
    return NextResponse.json(
      { error: "Failed to delete song" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

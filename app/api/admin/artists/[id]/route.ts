// app/api/admin/artists/[id]/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "../../_utils";
import { supabase } from "@/lib/supabaseClient";
import { cleanupArtistAssets } from "@/features/storage/server/cleanup";

const zPatchArtist = z.object({
  display_name: z.string().min(1).max(64).optional(),
  status: z.enum(["approved", "disabled"]).optional(),
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
  const parsed = zPatchArtist.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("artists")
    .update(parsed.data)
    .eq("id", id)
    .select("id, slug, display_name, status, created_at")
    .maybeSingle();

  if (error || !data) {
    console.error("admin artists PATCH error", error);
    return NextResponse.json(
      { error: "Failed to update artist" },
      { status: 500 }
    );
  }

  return NextResponse.json({ artist: data });
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

  await cleanupArtistAssets(id);
  
  const { error } = await supabase.from("artists").delete().eq("id", id);

  if (error) {
    console.error("admin artists DELETE error", error);
    return NextResponse.json(
      { error: "Failed to delete artist" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

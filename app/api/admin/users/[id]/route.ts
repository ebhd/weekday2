// drillrecord/app/api/admin/users/[id]/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "../../_utils";
import { supabase } from "@/lib/supabaseClient";

const zPatchUser = z.object({
  username: z.string().min(1).max(32).nullable().optional(),
  role: z.enum(["admin_full", "admin_reviewer", "artist", "user"]).optional(),
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
  const parsed = zPatchUser.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const patch = parsed.data;

  //Removed cus adminguard already checks for full admin
  // if (guard.payload.role === "admin_reviewer" && patch.role === "admin_full") {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  const { data, error } = await supabase
    .from("users")
    .update(patch)
    .eq("id", id)
    .select("id, email, username, role, created_at")
    .maybeSingle();

  if (error || !data) {
    console.error("admin users PATCH error", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }

  return NextResponse.json({ user: data });
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

  if (guard.payload.sub === id) {
    return NextResponse.json(
      { error: "You cannot delete yourself" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    console.error("admin users DELETE error", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

// drillrecord/app/api/admin/team/[id]/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "../../_utils";
import { supabase } from "@/lib/supabaseClient";

const zPatchTeam = z.object({
  role: z.enum(["admin_full", "admin_reviewer"]),
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
  const parsed = zPatchTeam.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (guard.payload.sub === id) {
    return NextResponse.json(
      { error: "You cannot change your own role" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("users")
    .update({ role: parsed.data.role })
    .eq("id", id)
    .select("id,email,username,role,created_at")
    .maybeSingle();

  if (error || !data) {
    console.error("team PATCH error", error);
    return NextResponse.json(
      { error: "Failed to update admin" },
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
      { error: "You cannot remove yourself" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("users")
    .update({ role: "user" })
    .eq("id", id)
    .select("id,email,username,role,created_at")
    .maybeSingle();

  if (error || !data) {
    console.error("team DELETE error", error);
    return NextResponse.json(
      { error: "Failed to remove admin" },
      { status: 500 }
    );
  }

  return NextResponse.json({ user: data });
}

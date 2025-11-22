// drillrecord/app/api/admin/team/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard } from "../_utils";
import { supabase } from "@/lib/supabaseClient";

const zPromote = z.object({
  email: z.email(),
  role: z.enum(["admin_full", "admin_reviewer"]).default("admin_reviewer"),
});

export async function POST(req: Request) {
  const guard = await adminGuard("full");
  if (!guard.ok) return guard.res;

  const body = await req.json().catch(() => null);
  const parsed = zPromote.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const role = parsed.data.role;

  const { data: user, error: findErr } = await supabase
    .from("users")
    .select("id, email, username, role, created_at")
    .eq("email", email)
    .maybeSingle();

  if (findErr || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.role === role) {
    return NextResponse.json({ user });
  }

  const { data: updated, error: upErr } = await supabase
    .from("users")
    .update({ role })
    .eq("id", user.id)
    .select("id,email,username,role,created_at")
    .maybeSingle();

  if (upErr || !updated) {
    console.error("team promote error", upErr);
    return NextResponse.json(
      { error: "Failed to promote user" },
      { status: 500 }
    );
  }

  return NextResponse.json({ user: updated });
}

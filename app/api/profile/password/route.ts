// app/api/profile/password/route.ts

import "server-only";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { zPasswordUpdateBody } from "@/features/profile/schemas";
import { changeUserPassword } from "@/features/profile/server";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = zPasswordUpdateBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const ok = await changeUserPassword(user.id, parsed.data);
    if (!ok) {
      return NextResponse.json(
        { error: "Password update failed" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e?.message === "BAD_PASSWORD") {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }
    console.error("password POST error", e);
    return NextResponse.json(
      { error: "Password update failed" },
      { status: 500 }
    );
  }
}

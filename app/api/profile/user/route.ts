import "server-only";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { zUserProfileUpdateBody } from "@/features/profile/schemas";
import { updateUserProfile } from "@/features/profile/server";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = zUserProfileUpdateBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const updated = await updateUserProfile(user.id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
    return NextResponse.json({ profile: updated });
  } catch (e: any) {
    if (e?.message === "USERNAME_TAKEN") {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }
    console.error("profile PATCH error", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

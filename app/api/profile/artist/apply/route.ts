// app/api/profile/artist/apply/route.ts

import "server-only";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { zBeArtistBody } from "@/features/profile/schemas";
import { createArtistForUser } from "@/features/profile/server/beArtist";
import { signAccessToken, signRefreshToken } from "@/lib/auth/token";
import { setAuthCookies } from "@/app/api/auth/_utils";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role === "artist") {
    return NextResponse.json({ error: "Already an artist" }, { status: 409 });
  }

  const body = await req.json().catch(() => null);
  const parsed = zBeArtistBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const artist = await createArtistForUser(user.id, parsed.data);

    const payload = {
      sub: user.id,
      email: user.email,
      role: "artist" as const,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const res = NextResponse.json({ artist });
    setAuthCookies(res, accessToken, refreshToken);

    return res;
  } catch (e: any) {
    const msg = e?.message;

    if (msg === "ALREADY_ARTIST") {
      return NextResponse.json({ error: "Already an artist" }, { status: 409 });
    }
    if (msg === "SLUG_TAKEN") {
      return NextResponse.json(
        { error: "Slug already taken" },
        { status: 409 }
      );
    }

    console.error("artist apply error", e);
    return NextResponse.json(
      { error: "Failed to become an artist" },
      { status: 500 }
    );
  }
}

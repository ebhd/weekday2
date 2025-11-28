// app/api/profile/artist/route.ts

import "server-only";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { zArtistProfileUpdateBody } from "@/features/profile/schemas";
import {
  getArtistProfileByUserId,
  updateArtistProfile,
} from "@/features/profile/server/artists";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const artist = await getArtistProfileByUserId(user.id);
  if (!artist)
    return NextResponse.json({ error: "Not an artist" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = zArtistProfileUpdateBody.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  try {
    const updated = await updateArtistProfile(artist.id, {
      slug: parsed.data.slug,
      displayName: parsed.data.displayName,
      bio: parsed.data.bio,
      socials: parsed.data.socials,
    });

    if (!updated)
      return NextResponse.json({ error: "Update failed" }, { status: 500 });

    return NextResponse.json({ artist: updated });
  } catch (e: any) {
    if (e?.message === "SLUG_TAKEN") {
      return NextResponse.json(
        { error: "Slug already in use" },
        { status: 409 }
      );
    }
    console.error("artist PATCH error", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

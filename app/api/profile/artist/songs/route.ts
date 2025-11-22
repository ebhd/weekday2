import "server-only";

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/currentUser";
import { supabase } from "@/lib/supabaseClient";
import { getArtistIdForUser, getMySongs } from "@/features/my-songs/server";

export const runtime = "nodejs";

const BUCKET = "drillrecords-assets";

const zCreateSongFromUpload = z.object({
  title: z.string().min(1).max(120),
  path: z.string().min(1),
  publicUrl: z.url(),
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function generateUniqueSlug(base: string) {
  let slug = base;
  for (let i = 0; i < 5; i++) {
    const { data } = await supabase
      .from("songs")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return `${base}-${randomUUID().slice(0, 8)}`;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ songs: [] }, { status: 401 });

  const artistId = await getArtistIdForUser(user.id);
  if (!artistId) return NextResponse.json({ songs: [] }, { status: 403 });

  const songs = await getMySongs(artistId);
  return NextResponse.json({ songs });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const artistId = await getArtistIdForUser(user.id);
  if (!artistId) {
    return NextResponse.json({ error: "Artist only" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = zCreateSongFromUpload.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { title, path, publicUrl } = parsed.data;

  // Safety: enforce ownership prefix so user can’t inject someone else’s path/url
  const expectedPrefix = `songs/${artistId}/`;
  if (!path.startsWith(expectedPrefix)) {
    return NextResponse.json(
      { error: "Invalid storage path" },
      { status: 400 }
    );
  }

  const baseSlug = slugify(title);
  const slug = await generateUniqueSlug(baseSlug);

  const { data: inserted, error: insErr } = await supabase
    .from("songs")
    .insert({
      artist_id: artistId,
      title: title.trim(),
      slug,
      audio_url: publicUrl,
      status: "pending",
      has_lyrics: false,
    })
    .select(
      "id, title, slug, audio_url, duration_sec, released_at, status, created_at, approved_at"
    )
    .maybeSingle();

  if (insErr || !inserted) {
    console.error("insert song error", insErr);
    // best-effort cleanup of uploaded file
    await supabase.storage
      .from(BUCKET)
      .remove([path])
      .catch(() => {});
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json({
    song: {
      id: inserted.id,
      title: inserted.title,
      slug: inserted.slug,
      audioUrl: inserted.audio_url,
      durationSec: inserted.duration_sec,
      releasedAt: inserted.released_at,
      status: inserted.status,
      createdAt: inserted.created_at,
      approvedAt: inserted.approved_at,
    },
  });
}

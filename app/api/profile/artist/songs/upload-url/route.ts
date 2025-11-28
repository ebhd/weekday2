// app/api/profile/artist/songs/upload-url/route.ts

import "server-only";

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/currentUser";
import { supabase } from "@/lib/supabaseClient";
import { getArtistIdForUser } from "@/features/my-songs/server";
import { STORAGE_BUCKET } from "@/features/storage/shared";

export const runtime = "nodejs";

const MAX_AUDIO_MB = 15;

const ALLOWED_MIME = new Set([
  "audio/mpeg",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/aac",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
]);

const zUploadUrlBody = z.object({
  title: z.string().min(1).max(120),
  mime: z.string().min(1),
  size: z.number().int().positive(), // bytes
});

function extFromMime(mime: string) {
  if (mime === "audio/mpeg") return "mp3";

  if (
    mime === "audio/mp4" ||
    mime === "audio/m4a" ||
    mime === "audio/x-m4a" ||
    mime === "audio/aac"
  ) {
    return "m4a";
  }

  if (mime === "audio/ogg") return "ogg";
  if (mime.includes("wav")) return "wav";

  return "bin";
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
  const parsed = zUploadUrlBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { mime, size } = parsed.data;

  if (!ALLOWED_MIME.has(mime)) {
    return NextResponse.json(
      { error: "Unsupported audio format" },
      { status: 415 }
    );
  }

  const sizeMb = size / (1024 * 1024);
  if (sizeMb > MAX_AUDIO_MB) {
    return NextResponse.json(
      { error: `File too large (max ${MAX_AUDIO_MB}MB)` },
      { status: 413 }
    );
  }

  const ext = extFromMime(mime);
  const storagePath = `songs/${artistId}/${randomUUID()}.${ext}`;

  // Signed upload URL (short-lived token)
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    console.error("createSignedUploadUrl error", error);
    return NextResponse.json(
      { error: "Failed to prepare upload" },
      { status: 500 }
    );
  }

  const { data: pub } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return NextResponse.json({
    path: storagePath,
    token: data.token,
    signedUrl: data.signedUrl,
    publicUrl: pub.publicUrl,
  });
}

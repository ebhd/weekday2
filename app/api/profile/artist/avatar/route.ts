// app/api/profile/artist/avatar/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { supabase } from "@/lib/supabaseClient";
import {
  getArtistProfileByUserId,
  getArtistProfileById,
} from "@/features/profile/server/artists";
import {
  deleteIfExists,
  uploadPublicBuffer,
} from "@/features/profile/server/storage";
import { compressImageFile } from "@/features/profile/server/image";

export const runtime = "nodejs";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/avif"];

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const artist = await getArtistProfileByUserId(user.id);
  if (!artist)
    return NextResponse.json({ error: "Not an artist" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  try {
    await deleteIfExists(artist.avatarUrl);

    const compressed = await compressImageFile(file, {
      maxWidth: 512,
      maxHeight: 512,
      quality: 80,
      format: "webp",
    });

    const uploaded = await uploadPublicBuffer({
      folder: "avatars",
      ownerId: artist.id,
      buffer: compressed.buffer,
      contentType: compressed.contentType,
      ext: compressed.ext,
    });

    const { error: upErr } = await supabase
      .from("artists")
      .update({
        avatar_url: uploaded.publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", artist.id);

    if (upErr) throw upErr;

    const fresh = await getArtistProfileById(artist.id);
    return NextResponse.json({
      artist: fresh,
      compression: {
        originalBytes: compressed.originalBytes,
        compressedBytes: compressed.compressedBytes,
      },
    });
  } catch (e) {
    console.error("avatar upload error", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// features/profile/server/storage.ts
import "server-only";
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "drillrecords-assets";

export function getKeyFromPublicUrl(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

export async function deleteIfExists(publicUrl?: string | null) {
  if (!publicUrl) return;
  const key = getKeyFromPublicUrl(publicUrl);
  if (!key) return;

  const { error } = await supabase.storage.from(BUCKET).remove([key]);
  if (error) console.warn("deleteIfExists failed", error);
}

export async function uploadPublicBuffer(args: {
  folder: "avatars" | "banners";
  artistId: string;
  buffer: Buffer;
  contentType: string;
  ext: string;
}) {
  const { folder, artistId, buffer, contentType, ext } = args;

  const randomName = crypto.randomUUID();
  const key = `${folder}/${artistId}/${randomName}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(key, buffer, {
      upsert: false,
      contentType,
      cacheControl: "3600",
    });

  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return { key, publicUrl: pub.publicUrl };
}

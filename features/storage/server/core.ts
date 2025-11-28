// features/storage/server/core.ts
import "server-only";
import { supabase } from "@/lib/supabaseClient";
import { STORAGE_BUCKET } from "../shared";

export function getKeyFromPublicUrl(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

export async function deleteByPublicUrl(publicUrl?: string | null) {
  if (!publicUrl) return;
  const key = getKeyFromPublicUrl(publicUrl);
  if (!key) return;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([key]);

  if (error) console.warn("deleteByPublicUrl failed", error);
}

export async function deleteByPublicUrls(urls: (string | null | undefined)[]) {
  const keys = urls
    .map((u) => (u ? getKeyFromPublicUrl(u) : null))
    .filter((k): k is string => !!k);

  if (!keys.length) return;

  const uniqueKeys = Array.from(new Set(keys));

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove(uniqueKeys);

  if (error) console.warn("deleteByPublicUrls failed", error);
}

export async function uploadPublicBuffer(args: {
  folder: string; // allow avatars, banners, songs, covers etc.
  ownerId: string; // e.g. artistId
  buffer: Buffer;
  contentType: string;
  ext: string;
}) {
  const { folder, ownerId, buffer, contentType, ext } = args;

  const randomName = crypto.randomUUID();
  const key = `${folder}/${ownerId}/${randomName}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(key, buffer, {
      upsert: false,
      contentType,
      cacheControl: "3600",
    });

  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(key);
  return { key, publicUrl: pub.publicUrl };
}

// features/profile/server/artists.ts
import "server-only";

import { supabase } from "@/lib/supabaseClient";
import type { ArtistProfile, ArtistProfileUpdateInput } from "../types";

// helper: map row -> domain
function mapArtist(row: any): ArtistProfile {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    displayName: row.display_name,
    bio: row.bio ?? null,
    avatarUrl: row.avatar_url ?? null,
    bannerUrl: row.banner_url ?? null,
    socials: row.socials ?? {},
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getArtistProfileByUserId(
  userId: string
): Promise<ArtistProfile | null> {
  const { data, error } = await supabase
    .from("artists")
    .select(
      "id, user_id, slug, display_name, bio, avatar_url, banner_url, socials, status, created_at"
    )
    .eq("user_id", userId)

    .eq("status", "approved")
    .maybeSingle();

  if (error) {
    console.error("getArtistProfileByUserId error", error);
    return null;
  }
  if (!data) return null;

  return mapArtist(data);
}

export async function getArtistProfileById(
  artistId: string
): Promise<ArtistProfile | null> {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("id", artistId)
    .maybeSingle();

  if (error) {
    console.error("getArtistProfileById error", error);
    return null;
  }
  if (!data) return null;

  return mapArtist(data);
}

export async function updateArtistProfile(
  artistId: string,
  input: ArtistProfileUpdateInput
): Promise<ArtistProfile | null> {
  if (input.slug) {
    const { data: existing, error: exErr } = await supabase
      .from("artists")
      .select("id")
      .eq("slug", input.slug)
      .maybeSingle();

    if (exErr) console.error("slug check error", exErr);
    if (existing && existing.id !== artistId) {
      throw new Error("SLUG_TAKEN");
    }
  }

  const { data, error } = await supabase
    .from("artists")
    .update({
      slug: input.slug,
      display_name: input.displayName,
      bio: input.bio ?? undefined,
      socials: input.socials ?? undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", artistId)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("updateArtistProfile error", error);
    return null;
  }
  if (!data) return null;

  return mapArtist(data);
}

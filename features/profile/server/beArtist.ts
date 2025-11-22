// features/profile/server/beArtist.ts
import "server-only";

import { supabase } from "@/lib/supabaseClient";
import type { BeArtistBody } from "@/features/profile/schemas";

export async function createArtistForUser(userId: string, input: BeArtistBody) {
  const { data: existingArtist, error: exErr } = await supabase
    .from("artists")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (exErr) {
    console.error("createArtistForUser existing check error", exErr);
    throw new Error("CHECK_FAILED");
  }
  if (existingArtist) {
    throw new Error("ALREADY_ARTIST");
  }

  const { data: slugTaken, error: slugErr } = await supabase
    .from("artists")
    .select("id")
    .eq("slug", input.slug)
    .maybeSingle();

  if (slugErr) {
    console.error("createArtistForUser slug check error", slugErr);
    throw new Error("CHECK_FAILED");
  }
  if (slugTaken) {
    throw new Error("SLUG_TAKEN");
  }

  const now = new Date().toISOString();

  const { data: inserted, error: insErr } = await supabase
    .from("artists")
    .insert({
      user_id: userId,
      slug: input.slug,
      display_name: input.displayName,
      bio: input.bio ?? null,
      socials: input.socials ?? null,
      status: "approved",
      applied_at: now,
      approved_at: now,
      approved_by: null,
      updated_at: now,
    })
    .select(
      "id, user_id, slug, display_name, bio, avatar_url, banner_url, socials, status, applied_at, approved_at, created_at, updated_at"
    )
    .maybeSingle();

  if (insErr || !inserted) {
    console.error("createArtistForUser insert error", insErr);
    throw insErr ?? new Error("INSERT_FAILED");
  }

  const { error: upUserErr } = await supabase
    .from("users")
    .update({
      role: "artist",
      updated_at: now,
    })
    .eq("id", userId);

  if (upUserErr) {
    console.error("createArtistForUser update user role error", upUserErr);
    throw new Error("ROLE_UPDATE_FAILED");
  }

  return {
    id: inserted.id,
    userId: inserted.user_id,
    slug: inserted.slug,
    displayName: inserted.display_name,
    bio: inserted.bio ?? null,
    avatarUrl: inserted.avatar_url ?? null,
    bannerUrl: inserted.banner_url ?? null,
    socials: inserted.socials ?? null,
    status: inserted.status,
    appliedAt: inserted.applied_at,
    approvedAt: inserted.approved_at,
    createdAt: inserted.created_at,
    updatedAt: inserted.updated_at,
  };
}

import "server-only";
import { supabase } from "@/lib/supabaseClient";
import type { AdminArtistRow } from "@/features/admin/types";

export async function getAdminArtists(): Promise<AdminArtistRow[]> {
  const { data, error } = await supabase
    .from("artists")
    .select(
      `
      id,
      slug,
      display_name,
      status,
      created_at,
      users:user_id ( email )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminArtists error", error);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    display_name: row.display_name,
    status: row.status,
    created_at: row.created_at,
    user_email: row.users?.email ?? null,
  })) as AdminArtistRow[];
}

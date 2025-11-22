import "server-only";
import { supabase } from "@/lib/supabaseClient";
import type { AdminTeamRow } from "@/features/admin/types";

export async function getAdminTeam(): Promise<AdminTeamRow[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id,email,username,role,created_at")
    .in("role", ["admin_full", "admin_reviewer"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminTeam error", error);
    return [];
  }

  return (data ?? []) as AdminTeamRow[];
}

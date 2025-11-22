// features/admin/server/candidates.ts
import "server-only";
import { supabase } from "@/lib/supabaseClient";
import type { AdminCandidateRow } from "@/features/admin/types";

export async function getAdminCandidates(): Promise<AdminCandidateRow[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id,email,username,role,created_at")
    .in("role", ["user", "artist"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminCandidates error", error);
    return [];
  }

  return (data ?? []) as AdminCandidateRow[];
}

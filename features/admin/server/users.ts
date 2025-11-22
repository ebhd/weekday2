import "server-only";
import { supabase } from "@/lib/supabaseClient";
import type { AdminUserRow } from "@/features/admin/types";

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id,email,username,role,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminUsers error", error);
    return [];
  }

  return (data ?? []) as AdminUserRow[];
}

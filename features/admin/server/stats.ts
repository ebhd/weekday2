import "server-only";
import { supabase } from "@/lib/supabaseClient";
import type { AdminStats } from "@/features/admin/types";

export async function getAdminStats(): Promise<AdminStats> {
  const [totalAccountsRes, totalAdminsRes, totalArtistsRes] = await Promise.all(
    [
      supabase.from("users").select("id", { head: true, count: "exact" }),

      supabase
        .from("users")
        .select("id", { head: true, count: "exact" })
        .in("role", ["admin_full", "admin_reviewer"]),

      supabase
        .from("artists")
        .select("id", { head: true, count: "exact" })
        .eq("status", "approved"),
    ]
  );

  if (totalAccountsRes.error) {
    console.error("getAdminStats totalAccounts error", totalAccountsRes.error);
  }
  if (totalAdminsRes.error) {
    console.error("getAdminStats totalAdmins error", totalAdminsRes.error);
  }
  if (totalArtistsRes.error) {
    console.error("getAdminStats totalArtists error", totalArtistsRes.error);
  }

  const totalVisitors = 0;

  return {
    totalAccounts: totalAccountsRes.count ?? 0,
    totalAdmins: totalAdminsRes.count ?? 0,
    totalArtists: totalArtistsRes.count ?? 0,
    totalVisitors,
  };
}

import { getAdminUsers } from "@/features/admin/server/users";
import { getAdminArtists } from "@/features/admin/server/artists";
import { getAdminSongs } from "@/features/admin/server/songs";

import { TablesClient } from "@/features/admin/components/TablesClient";
import { redirect } from "next/dist/client/components/navigation";
import { getCurrentUser } from "@/lib/auth/currentUser";

export const revalidate = 0;

export default async function TablesDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin_full") {
    redirect("/admin");
  }
  const [users, artists, songs] = await Promise.all([
    getAdminUsers(),
    getAdminArtists(),
    getAdminSongs(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Tables</h1>
      <TablesClient users={users} artists={artists} songs={songs} />
    </div>
  );
}

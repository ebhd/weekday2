
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { getAdminCandidates } from "@/features/admin/server/candidates";
import { getAdminTeam } from "@/features/admin/server/team";

import { TeamClient } from "@/features/admin/components/TeamClient";

export default async function TeamDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin_full") {
    redirect("/admin");
  }

  const [admins, candidates] = await Promise.all([
    getAdminTeam(),
    getAdminCandidates(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold font-display">Team</h1>
      <TeamClient admins={admins} candidates={candidates} />
    </div>
  );
}

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { getPendingSongs } from "@/features/admin/server/submits";
import { SubmitsClient } from "@/features/admin/components/SubmitsClient";

export const revalidate = 0;

export default async function SubmitsDashboard() {
  const user = await getCurrentUser();
  if (!user || !user.role.startsWith("admin")) {
    redirect("/admin");
  }

  const pendingSongs = await getPendingSongs();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Submits</h1>
      <SubmitsClient initialSongs={pendingSongs} />
    </div>
  );
}

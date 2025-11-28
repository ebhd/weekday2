// app/(profile)/profile/beartist/page.tsx

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { BeArtistForm } from "@/features/profile/components/BeAnArtist";
import { getUserProfileById } from "@/features/profile/server/users";
export const revalidate = 0;

export default async function BeArtistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/profile/be-artist");

  if (user.role === "artist") redirect("/");

  const profile = await getUserProfileById(user.id);
  if (!profile) redirect("/");

  const initialSlug =
    profile.username?.toLowerCase().replace(/\s+/g, "-") ?? "";
  const initialDisplayName = profile.username ?? "";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Be an Artist</h1>
      <BeArtistForm
        initialSlug={initialSlug}
        initialDisplayName={initialDisplayName}
      />
    </div>
  );
}

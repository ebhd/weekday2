// app/(profile)/profile/page.tsx

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/currentUser";

import { getUserProfileById } from "@/features/profile/server/users";
import { getArtistProfileByUserId } from "@/features/profile/server/artists";

import { UserProfileForm } from "@/features/profile/components/UserProfileForm";
import { ArtistProfileForm } from "@/features/profile/components/ArtistProfileForm";

export const revalidate = 0;

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/profile");

  const [profile, artist] = await Promise.all([
    getUserProfileById(user.id),
    getArtistProfileByUserId(user.id),
  ]);

  if (!profile) redirect("/");

  const isArtist = !!artist;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Profile</h1>

      {isArtist ? (
        <ArtistProfileForm initialArtist={artist!} />
      ) : (
        <UserProfileForm initialProfile={profile} />
      )}
    </div>
  );
}

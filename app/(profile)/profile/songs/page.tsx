import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { getArtistIdForUser, getMySongs } from "@/features/my-songs/server";
import { MySongsScreen } from "@/features/my-songs/components/MySongsScreen";

export const revalidate = 0;

export default async function MySongs() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/dashboard/my-songs");

  const artistId = await getArtistIdForUser(user.id);
  if (!artistId) redirect("/dashboard/profile");

  const songs = await getMySongs(artistId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold font-display">My Songs</h1>
      <MySongsScreen initialSongs={songs} />
    </div>
  );
}

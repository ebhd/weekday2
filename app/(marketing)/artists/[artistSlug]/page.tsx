import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArtistBySlug, getArtistSongs } from "@/features/artists/api";
import { ArtistProfileSection } from "@/components/blocks/ArtistProfileSection";

type Params = { artistSlug: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { artistSlug } = await params;

  const artist = await getArtistBySlug(artistSlug);
  
  if (!artist) return notFound();

  const songs = await getArtistSongs(artist.id);
  return <ArtistProfileSection artist={artist} songs={songs} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { artistSlug } = await params;
  const artist = await getArtistBySlug(artistSlug);
  if (!artist) return { title: "Artist not found" };
  return {
    title: `${artist.name} — DrillRecords`,
    description: artist.profile?.bio ?? "",
    openGraph: {
      title: artist.name,
      images: [artist.profile?.avatarUrl || ""],
    },
  };
}

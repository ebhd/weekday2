// app/(marketing)/songs/[songSlug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSongWithArtistPreview } from "@/features/songs/server";
import { SongProfileSection } from "@/features/marketing/SongProfileSection";

type Params = { songSlug: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { songSlug } = await params;
  const data = await getSongWithArtistPreview(songSlug);
  if (!data) return notFound();
  return <SongProfileSection song={data.song} artists={[data.artist]} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { songSlug } = await params;
  const data = await getSongWithArtistPreview(songSlug);
  if (!data) return { title: "Song not found" };
  const { song } = data;
  return {
    title: `${song.title} — ${song.artist.name} | Weekday`,
    description: `${song.title} by ${song.artist.name}`,
    openGraph: {
      title: song.title,
      images: [song.coverUrl || song.artist.avatarUrl || ""],
    },
  };
}

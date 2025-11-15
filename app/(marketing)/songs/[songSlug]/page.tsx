import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSongWithArtists } from "@/features/songs/api";
import { SongProfileSection } from "@/components/blocks/SongProfileSection";

type Params = { songSlug: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { songSlug } = await params;
  const data = await getSongWithArtists(songSlug);
  if (!data) return notFound();
  return <SongProfileSection song={data.song} artists={data.artists} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { songSlug } = await params;
  const data = await getSongWithArtists(songSlug);
  if (!data) return { title: "Song not found" };
  const { song } = data;
  return {
    title: `${song.title} — ${song.artist.name} | DrillRecords`,
    description: `${song.title} by ${song.artist.name}`,
    openGraph: {
      title: song.title,
      images: [song.coverUrl || song.artist.avatarUrl || ""],
    },
  };
}

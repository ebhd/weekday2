// features/storage/server/cleanup.ts
import "server-only";
import { supabase } from "@/lib/supabaseClient";
import { deleteByPublicUrls } from "./core";

export async function cleanupArtistAssets(artistId: string) {
  const { data: artist, error: artistErr } = await supabase
    .from("artists")
    .select("avatar_url, banner_url")
    .eq("id", artistId)
    .maybeSingle();

  if (artistErr) {
    console.error("cleanupArtistAssets: load artist failed", artistErr);
  }
  if (!artist) return;

  const { data: songs, error: songsErr } = await supabase
    .from("songs")
    .select("audio_url, cover_url")
    .eq("artist_id", artistId);

  if (songsErr) {
    console.error("cleanupArtistAssets: load songs failed", songsErr);
  }

  const songUrls =
    songs?.flatMap((s) => [s.audio_url as string | null, s.cover_url]) ?? [];

  await deleteByPublicUrls([artist.avatar_url, artist.banner_url, ...songUrls]);
}

export async function cleanupUserAssets(userId: string) {
  const { data: artists, error: artistsErr } = await supabase
    .from("artists")
    .select("id, avatar_url, banner_url")
    .eq("user_id", userId);

  if (artistsErr) {
    console.error("cleanupUserAssets: load artists failed", artistsErr);
    return;
  }
  if (!artists?.length) return;

  const artistIds = artists.map((a) => a.id as string);

  const { data: songs, error: songsErr } = await supabase
    .from("songs")
    .select("audio_url, cover_url")
    .in("artist_id", artistIds);

  if (songsErr) {
    console.error("cleanupUserAssets: load songs failed", songsErr);
  }

  const artistUrls = artists.flatMap((a) => [a.avatar_url, a.banner_url]);
  const songUrls =
    songs?.flatMap((s) => [s.audio_url as string | null, s.cover_url]) ?? [];

  await deleteByPublicUrls([...artistUrls, ...songUrls]);
}

"use client";

export async function reportSongPlay(songId: string): Promise<number | null> {
  try {
    const res = await fetch(`/api/reactions/song/${songId}/play`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("reportSongPlay error", data.error);
      return null;
    }

    if (typeof data.playCount === "number") {
      return data.playCount;
    }

    return null;
  } catch (e) {
    console.error("reportSongPlay network error", e);
    return null;
  }
}

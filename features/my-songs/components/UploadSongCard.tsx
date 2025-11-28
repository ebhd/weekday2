// features/my-songs/components/UploadSongCard.tsx
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MySongRow } from "../types";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { STORAGE_BUCKET } from "@/features/storage/shared";

type Props = {
  onCreated: (song: MySongRow) => void;
};

const MAX_AUDIO_MB = 15;
const ALLOWED_MIME = new Set([
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/aac",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
]);

export function UploadSongCard({ onCreated }: Props) {
  const [title, setTitle] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanTitle = title.trim();
    if (!cleanTitle) return setError("Title is required.");
    if (!file) return setError("Audio file is required.");

    if (!ALLOWED_MIME.has(file.type)) {
      return setError("Unsupported audio format. Use mp3, m4a, wav, or ogg.");
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_AUDIO_MB) {
      return setError(
        `File too large. Max ${MAX_AUDIO_MB}MB. Please compress your audio.`
      );
    }

    setUploading(true);

    try {
      // 1) ask server for signed upload URL
      const prepRes = await fetch("/api/profile/artist/songs/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: cleanTitle,
          mime: file.type,
          size: file.size,
        }),
      });

      const prep = await prepRes.json();
      if (!prepRes.ok) {
        setError(prep.error ?? "Failed to prepare upload.");
        return;
      }

      const { path, token, publicUrl } = prep as {
        path: string;
        token: string;
        publicUrl: string;
      };

      // 2) upload directly to Supabase storage using signed token
      const { error: upErr } = await supabaseBrowser.storage
        .from(STORAGE_BUCKET)
        .uploadToSignedUrl(path, token, file, {
          contentType: file.type,
          upsert: false,
        });

      if (upErr) {
        console.error("signed upload error", upErr);
        setError("Upload failed.");
        return;
      }

      // 3) create DB row
      const createRes = await fetch("/api/profile/artist/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: cleanTitle,
          path,
          publicUrl,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        setError(createData.error ?? "Failed to save song.");
        return;
      }

      onCreated(createData.song);
      setTitle("");
      setFile(null);
      setSuccess("Song uploaded! Pending approval.");
    } catch (e) {
      console.error(e);
      setError("Something went wrong.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="bg-surface border-muted-fg/30">
      <CardHeader>
        <CardTitle className="font-display text-xl">
          Upload a new song
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(error || success) && (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-500/30 bg-red-500/10 text-red-200"
                : "border-green-500/30 bg-green-500/10 text-green-200"
            }`}
          >
            {error ?? success}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          <Input
            placeholder="Song title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
          />

          <Input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />

          <Button disabled={uploading} className="w-full">
            {uploading ? "Uploading..." : "Upload Song"}
          </Button>

          <p className="text-xs text-white/50">
            Supported: mp3, m4a, wav, ogg. Max {MAX_AUDIO_MB}MB.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

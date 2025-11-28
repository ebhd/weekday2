// features/profile/components/ArtistProfileForm.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ArtistProfile } from "../types";
import { notifyError, notifySuccess } from "@/features/notifications/store";

type Props = { initialArtist: ArtistProfile };

export function ArtistProfileForm({ initialArtist }: Props) {
  const [artist, setArtist] = React.useState(initialArtist);

  const [slug, setSlug] = React.useState(artist.slug);
  const [displayName, setDisplayName] = React.useState(artist.displayName);
  const [bio, setBio] = React.useState(artist.bio ?? "");
  const [socialsRaw, setSocialsRaw] = React.useState(
    JSON.stringify(artist.socials ?? {}, null, 2)
  );

  const [saving, setSaving] = React.useState(false);
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
  const [uploadingBanner, setUploadingBanner] = React.useState(false);

  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function saveArtist(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    let socials: any = null;
    try {
      socials = socialsRaw.trim() ? JSON.parse(socialsRaw) : null;
    } catch {
      setError(
        'Socials must be valid JSON (example: { "instagram": "https://..." })'
      );
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile/artist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          slug,
          displayName,
          bio: bio.trim() ? bio : null,
          socials,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update artist");
        return;
      }

      setArtist(data.artist);
      setSlug(data.artist.slug);
      setDisplayName(data.artist.displayName);
      setBio(data.artist.bio ?? "");
      setSocialsRaw(JSON.stringify(data.artist.socials ?? {}, null, 2));
      setSuccess("Artist profile updated.");
      notifySuccess("Artist profile updated.");
    } catch (err) {
      console.error(err);
      notifyError("Contact our support.");
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(kind: "avatar" | "banner", file: File) {
    const setUploading =
      kind === "avatar" ? setUploadingAvatar : setUploadingBanner;
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`/api/profile/artist/${kind}`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }

      setArtist(data.artist);
      setSuccess(`${kind === "avatar" ? "Avatar" : "Banner"} updated.`);
    } catch (err) {
      console.error(err);
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function onPick(kind: "avatar" | "banner") {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      uploadFile(kind, f);
      e.currentTarget.value = "";
    };
  }

  return (
    <div className="space-y-6">
      {(error || success) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-red-500/30 bg-red-500/10 text-red-200"
              : "border-green-500/30 bg-green-500/10 text-green-200"
          }`}
          role="alert"
        >
          {error ?? success}
        </div>
      )}

      {/* Banner preview */}
      <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-white/10 bg-black/30">
        {artist.bannerUrl ? (
          <Image
            src={artist.bannerUrl}
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
            No banner yet
          </div>
        )}

        {/* ✅ input separate + label via Button */}
        <input
          id="banner-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPick("banner")}
          disabled={uploadingBanner}
        />

        <Button
          asChild
          size="sm"
          disabled={uploadingBanner}
          className="absolute right-3 bottom-3"
        >
          <label htmlFor="banner-upload" className="cursor-pointer">
            {uploadingBanner ? "Uploading..." : "Change banner"}
          </label>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avatar */}
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="font-display text-xl">Avatar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden ring-2 ring-white/10 bg-black/40">
                <Image
                  src={artist.avatarUrl || "/default-avatar.png"}
                  alt={artist.displayName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* ✅ input separate + label via Button */}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPick("avatar")}
                disabled={uploadingAvatar}
              />

              <Button asChild size="sm" disabled={uploadingAvatar}>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  {uploadingAvatar ? "Uploading..." : "Change avatar"}
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Artist info (unchanged) */}
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Artist details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveArtist} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="slug">Slug</FieldLabel>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                    }
                    placeholder="my-artist-name"
                    minLength={3}
                    maxLength={40}
                    required
                  />
                  <FieldDescription>
                    Used in your public URL. Kebab-case only.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="displayName">Display name</FieldLabel>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    minLength={2}
                    maxLength={64}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={600}
                    placeholder="Tell people about your music..."
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="socials">Socials (JSON)</FieldLabel>
                  <Textarea
                    id="socials"
                    value={socialsRaw}
                    onChange={(e) => setSocialsRaw(e.target.value)}
                    className="font-mono text-xs min-h-[120px]"
                    placeholder='{ "instagram": "https://instagram.com/you" }'
                  />
                </Field>

                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? "Saving..." : "Save artist profile"}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>

      <FieldSeparator />
    </div>
  );
}

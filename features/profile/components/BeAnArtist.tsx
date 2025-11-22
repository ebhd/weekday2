"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  initialSlug?: string;
  initialDisplayName?: string;
};

export function BeArtistForm({
  initialSlug = "",
  initialDisplayName = "",
}: Props) {
  const router = useRouter();

  const [slug, setSlug] = React.useState(initialSlug);
  const [displayName, setDisplayName] = React.useState(initialDisplayName);
  const [bio, setBio] = React.useState("");
  const [socialsRaw, setSocialsRaw] = React.useState("{}");

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
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
      const res = await fetch("/api/profile/artist/apply", {
        method: "POST",
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
        setError(data.error ?? "Failed to become an artist");
        return;
      }

      setSuccess("You're now an artist! 🎉 Redirecting...");

      router.refresh();
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="bg-black/30 border-white/10">
      <CardHeader>
        <CardTitle className="font-display text-xl">Become an Artist</CardTitle>
        <p className="text-sm text-white/60">
          Create your artist profile. You can upload avatar/banner after this
          step.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {(error || success) && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-500/30 bg-red-500/10 text-red-200"
                : "border-green-500/30 bg-green-500/10 text-green-200"
            }`}
          >
            {error ?? success}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input
                id="slug"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                  )
                }
                placeholder="my-artist-name"
                minLength={3}
                maxLength={40}
                required
              />
              <FieldDescription>
                Used in your public URL. Example:{" "}
                <span className="font-mono">
                  drillrecords.com/artists/my-artist-name
                </span>
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
              {saving ? "Creating artist profile..." : "Become an Artist"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

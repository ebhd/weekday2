"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { MySongRow } from "../types";

type Props = {
  song: MySongRow;
  onUpdated: (song: MySongRow) => void;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function EditSongDialog({ song, onUpdated }: Props) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(song.title);
  const [slug, setSlug] = React.useState(song.slug);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function save() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/artist/songs/${song.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, slug }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Update failed");
        return;
      }

      onUpdated(data.song);
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-black/95 border-white/10">
        <DialogHeader>
          <DialogTitle>Edit song</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={title}
            onChange={(e) => {
              const v = e.target.value;
              setTitle(v);
              setSlug(slugify(v));
            }}
          />

          <Input
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

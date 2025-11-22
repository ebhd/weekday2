"use client";

import * as React from "react";
import type { AdminSongRow } from "@/features/admin/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/features/admin/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiDelete, apiPatch } from "@/features/admin/client/adminApi";
import { useRouter } from "next/navigation";

export function SongsTable({ initial }: { initial: AdminSongRow[] }) {
  const router = useRouter();
  const [rows, setRows] = React.useState(initial);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Partial<AdminSongRow>>({});

  const startEdit = (row: AdminSongRow) => {
    setEditingId(row.id);
    setDraft({ title: row.title, status: row.status });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async (id: string) => {
    const current = rows.find((r) => r.id === id);
    if (!current) return;

    const patch: Pick<AdminSongRow, "title" | "status"> = {
      title: (draft.title ?? current.title).trim(),
      status: draft.status ?? current.status,
    };

    await apiPatch(`/api/admin/songs/${id}`, patch);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    router.refresh();
    cancelEdit();
  };

  const deleteRow = async (id: string) => {
    await apiDelete(`/api/admin/songs/${id}`);
    setRows((prev) => prev.filter((r) => r.id !== id));
    router.refresh();
  };

  const columns: ColumnDef<AdminSongRow>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const r = row.original;
        const editing = editingId === r.id;
        if (!editing) return r.title;
        return (
          <Input
            value={draft.title ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            className="h-8"
          />
        );
      },
    },
    { accessorKey: "slug", header: "Slug" },
    {
      accessorKey: "artist_name",
      header: "Artist",
      cell: ({ row }) => row.original.artist_name ?? "—",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const r = row.original;
        const editing = editingId === r.id;
        if (!editing) return <Badge>{r.status}</Badge>;

        const statuses: AdminSongRow["status"][] = [
          "pending",
          "approved",
          "rejected",
          "disabled",
        ];

        return (
          <select
            className="h-8 rounded-md bg-black/30 border border-white/10 px-2 text-sm"
            value={draft.status ?? r.status}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                status: e.target.value as AdminSongRow["status"],
              }))
            }
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        );
      },
    },
    { header: "Plays", accessorKey: "play_count" },
    { header: "Likes", accessorKey: "like_count" },
    { header: "Score", accessorKey: "score" },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const r = row.original;
        const editing = editingId === r.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                •••
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!editing ? (
                <DropdownMenuItem onClick={() => startEdit(r)}>
                  Edit
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => saveEdit(r.id)}>
                    Save
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={cancelEdit}>
                    Cancel
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => deleteRow(r.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      data={rows}
      columns={columns}
      searchKey="title"
      searchPlaceholder="Search songs by title..."
    />
  );
}

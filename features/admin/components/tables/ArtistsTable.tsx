"use client";

import * as React from "react";
import type { AdminArtistRow } from "@/features/admin/types";
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

export function ArtistsTable({ initial }: { initial: AdminArtistRow[] }) {
  const router = useRouter();
  const [rows, setRows] = React.useState(initial);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Partial<AdminArtistRow>>({});

  const startEdit = (row: AdminArtistRow) => {
    setEditingId(row.id);
    setDraft({ display_name: row.display_name, status: row.status });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async (id: string) => {
    const current = rows.find((r) => r.id === id);
    if (!current) return;

    const patch: Pick<AdminArtistRow, "display_name" | "status"> = {
      display_name: (draft.display_name ?? current.display_name).trim(),
      status: draft.status ?? current.status,
    };

    await apiPatch(`/api/admin/artists/${id}`, patch);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    router.refresh();
    cancelEdit();
  };

  const deleteRow = async (id: string) => {
    await apiDelete(`/api/admin/artists/${id}`);
    setRows((prev) => prev.filter((r) => r.id !== id));
    router.refresh();
  };

  const columns: ColumnDef<AdminArtistRow>[] = [
    {
      accessorKey: "display_name",
      header: "Name",
      cell: ({ row }) => {
        const r = row.original;
        const editing = editingId === r.id;
        if (!editing) return r.display_name;
        return (
          <Input
            value={draft.display_name ?? ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, display_name: e.target.value }))
            }
            className="h-8"
          />
        );
      },
    },
    { accessorKey: "slug", header: "Slug" },
    {
      accessorKey: "user_email",
      header: "Owner Email",
      cell: ({ row }) => row.original.user_email ?? "—",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const r = row.original;
        const editing = editingId === r.id;
        if (!editing) return <Badge>{r.status}</Badge>;

        const statuses: AdminArtistRow["status"][] = ["approved", "disabled"];

        return (
          <select
            className="h-8 rounded-md bg-black/30 border border-white/10 px-2 text-sm"
            value={draft.status ?? r.status}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                status: e.target.value as AdminArtistRow["status"],
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
      searchKey="display_name"
      searchPlaceholder="Search artists by name..."
    />
  );
}

"use client";

import * as React from "react";
import type { AdminTeamRow } from "@/features/admin/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/features/admin/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiDelete, apiPatch } from "@/features/admin/client/adminApi";

export function TeamTable({
  initial,
  onRoleChanged,
  onRemoved,
}: {
  initial: AdminTeamRow[];
  onRoleChanged: (u: AdminTeamRow) => void;
  onRemoved: (id: string) => void;
}) {
  const [rows, setRows] = React.useState(initial);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draftRole, setDraftRole] = React.useState<AdminTeamRow["role"] | null>(
    null
  );

  const startEdit = (r: AdminTeamRow) => {
    setEditingId(r.id);
    setDraftRole(r.role);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftRole(null);
  };

  const saveEdit = async (id: string) => {
    const current = rows.find((r) => r.id === id);
    if (!current || !draftRole) return;

    const patch = { role: draftRole };
    const res = await apiPatch(`/api/admin/team/${id}`, patch);

    const updated = res.user as AdminTeamRow;

    setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
    onRoleChanged(updated);
    cancelEdit();
  };

  const removeAdmin = async (id: string) => {
    await apiDelete(`/api/admin/team/${id}`);
    setRows((prev) => prev.filter((r) => r.id !== id));
    onRemoved(id);
  };

  const columns: ColumnDef<AdminTeamRow>[] = [
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => row.original.username ?? "—",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const r = row.original;
        const editing = editingId === r.id;

        if (!editing) {
          return <Badge variant="secondary">{r.role}</Badge>;
        }

        return (
          <select
            className="h-8 rounded-md bg-black/30 border border-white/10 px-2 text-sm"
            value={draftRole ?? r.role}
            onChange={(e) =>
              setDraftRole(e.target.value as AdminTeamRow["role"])
            }
          >
            <option value="admin_reviewer">admin_reviewer</option>
            <option value="admin_full">admin_full</option>
          </select>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Joined",
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
                  Edit role
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
                onClick={() => removeAdmin(r.id)}
              >
                Remove from team
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
      searchKey="email"
      searchPlaceholder="Search admins by email…"
    />
  );
}

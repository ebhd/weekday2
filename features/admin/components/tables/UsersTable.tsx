"use client";

import * as React from "react";
import type { AdminUserRow } from "@/features/admin/types";
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
import { notifyError, notifySuccess } from "@/features/notifications/store";

export function UsersTable({ initial }: { initial: AdminUserRow[] }) {
  const router = useRouter();

  const [rows, setRows] = React.useState(initial);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Partial<AdminUserRow>>({});

  const startEdit = (row: AdminUserRow) => {
    setEditingId(row.id);
    setDraft({ username: row.username ?? "", role: row.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async (id: string) => {
    const current = rows.find((r) => r.id === id);
    if (!current) return;

    const patch: Pick<AdminUserRow, "username" | "role"> = {
      username: (draft.username ?? current.username ?? "").trim() || null,
      role: draft.role ?? current.role,
    };

    await apiPatch(`/api/admin/users/${id}`, patch);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    router.refresh();
    cancelEdit();
    notifySuccess("User updated successfully!");
  };

  const deleteRow = async (id: string) => {
    await apiDelete(`/api/admin/users/${id}`);
    setRows((prev) => prev.filter((r) => r.id !== id));
    router.refresh();
    notifySuccess("User deleted successfully!");
  };

  const columns: ColumnDef<AdminUserRow>[] = [
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const r = row.original;
        const editing = editingId === r.id;
        if (!editing) return r.username ?? "—";
        return (
          <Input
            value={draft.username ?? ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, username: e.target.value }))
            }
            className="h-8"
          />
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const r = row.original;
        const editing = editingId === r.id;
        if (!editing) return <Badge variant="secondary">{r.role}</Badge>;

        const roles: AdminUserRow["role"][] = [
          "user",
          "artist",
          "admin_reviewer",
          "admin_full",
        ];

        return (
          <select
            className="h-8 rounded-md bg-black/30 border border-white/10 px-2 text-sm"
            value={draft.role ?? r.role}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                role: e.target.value as AdminUserRow["role"],
              }))
            }
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
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
      searchKey="email"
      searchPlaceholder="Search users by email..."
    />
  );
}

"use client";

import * as React from "react";
import type { AdminTeamRow, AdminCandidateRow } from "@/features/admin/types";
import { TeamTable } from "@/features/admin/components/tables/TeamTable";
import { AddAdminCard } from "@/features/admin/components/team/AddAdminCard";

export function TeamClient(props: {
  admins: AdminTeamRow[];
  candidates: AdminCandidateRow[];
}) {
  const [admins, setAdmins] = React.useState(props.admins);
  const [candidates, setCandidates] = React.useState(props.candidates);

  const onPromoted = (user: AdminTeamRow) => {
    setAdmins((prev) => [user, ...prev.filter((x) => x.id !== user.id)]);
    setCandidates((prev) => prev.filter((x) => x.id !== user.id));
  };

  const onRoleChanged = (user: AdminTeamRow) => {
    setAdmins((prev) => prev.map((x) => (x.id === user.id ? user : x)));
  };

  const onRemoved = (id: string) => {
    setAdmins((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-6">
      <AddAdminCard candidates={candidates} onPromoted={onPromoted} />
      <TeamTable
        initial={admins}
        onRoleChanged={onRoleChanged}
        onRemoved={onRemoved}
      />
    </div>
  );
}

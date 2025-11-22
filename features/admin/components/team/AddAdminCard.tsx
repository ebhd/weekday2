"use client";

import * as React from "react";
import type { AdminCandidateRow, AdminTeamRow } from "@/features/admin/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiPost } from "@/features/admin/client/adminApi";

export function AddAdminCard({
  candidates,
  onPromoted,
}: {
  candidates: AdminCandidateRow[];
  onPromoted: (u: AdminTeamRow) => void;
}) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] =
    React.useState<AdminTeamRow["role"]>("admin_reviewer");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const suggestions = React.useMemo(() => {
    const q = email.toLowerCase().trim();
    if (q.length < 2) return [];
    return candidates
      .filter((c) => c.email.toLowerCase().includes(q))
      .slice(0, 5);
  }, [email, candidates]);

  const promote = async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await apiPost<
        { email: string; role: AdminTeamRow["role"] },
        { user: AdminTeamRow }
      >("/api/admin/team", { email, role });

      onPromoted(json.user);
      setEmail("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-surface/70">
      <CardHeader>
        <CardTitle className="text-lg">Add Admin</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <div className="relative">
            <Input
              placeholder="User email…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-xl border border-white/10 bg-black/90 backdrop-blur p-1">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setEmail(s.email)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                  >
                    {s.email}{" "}
                    <span className="text-xs text-muted-fg">
                      ({s.username ?? "no username"})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            className="h-10 rounded-md bg-black/30 border border-white/10 px-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as AdminTeamRow["role"])}
          >
            <option value="admin_reviewer">admin_reviewer</option>
            <option value="admin_full">admin_full</option>
          </select>

          <Button disabled={loading || !email.trim()} onClick={promote}>
            {loading ? "Adding…" : "Add"}
          </Button>
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        <div className="text-xs text-white">
          Candidates: <Badge variant="secondary">{candidates.length}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

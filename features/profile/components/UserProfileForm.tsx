"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UserProfile } from "../types";

type Props = {
  initialProfile: UserProfile;
};

export function UserProfileForm({ initialProfile }: Props) {
  const [profile, setProfile] = React.useState(initialProfile);

  const [username, setUsername] = React.useState(profile.username);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");

  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);

  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSavingProfile(true);

    try {
      const res = await fetch("/api/profile/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update profile");
        return;
      }

      setProfile(data.profile);
      setUsername(data.profile.username);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update password");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSuccess("Password updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback */}
      {(error || success) && (
        <div
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            error
              ? "border-red-500/30 bg-red-500/10 text-red-200"
              : "border-green-500/30 bg-green-500/10 text-green-200"
          )}
          role="alert"
        >
          {error ?? success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Account details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" value={profile.email} disabled />
                  <FieldDescription>
                    Email can’t be changed yet.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    minLength={3}
                    maxLength={32}
                    required
                  />
                </Field>

                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full"
                >
                  {savingProfile ? "Saving..." : "Save changes"}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Password Card */}
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Change password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={savePassword} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="currentPassword">
                    Current password
                  </FieldLabel>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    maxLength={72}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmNewPassword">
                    Confirm new password
                  </FieldLabel>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </Field>

                <Button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full"
                >
                  {savingPassword ? "Updating..." : "Update password"}
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

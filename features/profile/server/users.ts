// features/profile/server/users.ts
import "server-only";

import { supabase } from "@/lib/supabaseClient";
import type {
  UserProfile,
  UserProfileUpdateInput,
  PasswordUpdateInput,
} from "../types";
import { findUserByUsername } from "@/features/auth/server/users";
import { verifyPassword, hashPassword } from "@/lib/auth/password";

export async function getUserProfileById(
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, username, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("getUserProfileById error", error);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    username: data.username,
    createdAt: data.created_at,
  };
}

export async function updateUserProfile(
  userId: string,
  input: UserProfileUpdateInput
): Promise<UserProfile | null> {
  if (input.username) {
    const existing = await findUserByUsername(input.username);
    if (existing && existing.id !== userId) {
      throw new Error("USERNAME_TAKEN");
    }
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      username: input.username?.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("id, email, username, created_at")
    .maybeSingle();

  if (error) {
    console.error("updateUserProfile error", error);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    username: data.username,
    createdAt: data.created_at,
  };
}

export async function changeUserPassword(
  userId: string,
  input: PasswordUpdateInput
): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select("password_hash")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    console.error("changeUserPassword load user error", error);
    return false;
  }

  const ok = await verifyPassword(input.currentPassword, data.password_hash);
  if (!ok) throw new Error("BAD_PASSWORD");

  const newHash = await hashPassword(input.newPassword);

  const { error: upErr } = await supabase
    .from("users")
    .update({
      password_hash: newHash,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (upErr) {
    console.error("changeUserPassword update error", upErr);
    return false;
  }

  return true;
}

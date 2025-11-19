// features/auth/server.ts
import { supabase } from "@/lib/supabaseClient";
import type { User, UserRole, UserRow } from "./types";

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    role: row.role,
    createdAt: row.created_at,
  };
}

export async function findUserByEmail(
  email: string
): Promise<(User & { passwordHash: string }) | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, username, password_hash, role, created_at")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("findUserByEmail error", error);
    return null;
  }
  if (!data) return null;

  const row = data as UserRow;
  return {
    ...mapUser(row),
    passwordHash: row.password_hash,
  };
}

export async function createUser(args: {
  email: string;
  username: string;
  passwordHash: string;
  role?: UserRole;
}): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert({
      email: args.email.toLowerCase(),
      username: args.username,
      password_hash: args.passwordHash,
      role: args.role ?? "user",
    })
    .select("id, email, username, role, created_at")
    .maybeSingle();

  if (error || !data) {
    console.error("createUser error", error);
    throw error ?? new Error("Failed to create user");
  }

  return mapUser(data as UserRow);
}

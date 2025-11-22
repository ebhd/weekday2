// features/auth/roles.ts
import type { AuthUser, UserRole } from "./types";

export const ADMIN_ROLES: UserRole[] = ["admin_full", "admin_reviewer"];

export function isAdmin(role: UserRole | undefined): boolean {
  return role === "admin_full" || role === "admin_reviewer";
}

export function isArtist(role: UserRole | undefined): boolean {
  return role === "artist";
}

export function isRegularUser(role: UserRole | undefined): boolean {
  return role === "user";
}

export function isLoggedIn(user: AuthUser | null): boolean {
  return !!user;
}

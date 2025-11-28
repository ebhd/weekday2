// features/auth/types.ts

export type UserRole = "admin_full" | "admin_reviewer" | "artist" | "user";

export type User = {
  id: string;
  email: string;
  username: string | null;
  role: UserRole;
  createdAt: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type UserRow = {
  id: string;
  email: string;
  username: string | null;
  password_hash: string;
  role: UserRole;
  created_at: string;
};

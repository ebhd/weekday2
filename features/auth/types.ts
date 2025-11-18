export type UserRole = "admin_full" | "admin_reviewer" | "artist" | "user";

export type User = {
  id: string;
  email: string;
  username: string | null;
  role: UserRole;
  createdAt: string;
};

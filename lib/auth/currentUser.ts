"server-only";

import { cookies } from "next/headers";
import { verifyAccessToken } from "./token";
import type { AuthUser } from "@/features/auth/types";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("dr_access_token")?.value;
  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}

// lib/auth/currentUser.ts
import { cookies } from "next/headers";
import { verifyAccessToken } from "./token";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("dr_access_token")?.value;
  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  return payload;
}

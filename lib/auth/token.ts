// lib/auth/tokens.ts
import jwt from "jsonwebtoken";
import type { UserRole } from "@/features/auth/types";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets not set");
}

export type AuthJwtPayload = {
  sub: string; // user id
  email: string;
  role: UserRole;
};

export function signAccessToken(payload: AuthJwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: AuthJwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AuthJwtPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as AuthJwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): AuthJwtPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as AuthJwtPayload;
  } catch {
    return null;
  }
}

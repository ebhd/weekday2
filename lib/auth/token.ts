// lib/auth/tokens.ts
import jwt from "jsonwebtoken";
import type { UserRole } from "@/features/auth/types";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets not set");
}

const ISSUER = "drillrecords";
const AUDIENCE = "drillrecords-web";
const ALGO: jwt.Algorithm = "HS256";

export type AuthJwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  tokenVersion?: number;
};

export function signAccessToken(payload: AuthJwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "15m",
    algorithm: ALGO,
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}
export function signRefreshToken(payload: AuthJwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "7d",
    algorithm: ALGO,
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}

export function verifyAccessToken(token: string): AuthJwtPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET, {
      algorithms: [ALGO],
      issuer: ISSUER,
      audience: AUDIENCE,
    }) as AuthJwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): AuthJwtPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET, {
      algorithms: [ALGO],
      issuer: ISSUER,
      audience: AUDIENCE,
    }) as AuthJwtPayload;
  } catch {
    return null;
  }
}

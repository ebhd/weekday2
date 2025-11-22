// drillrecord/app/api/admin/_utils.ts
import "server-only";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/token";
import type { AuthJwtPayload } from "@/lib/auth/token";
import type { UserRole } from "@/features/auth/types";

type GuardOk = { ok: true; payload: AuthJwtPayload };
type GuardFail = { ok: false; res: NextResponse };

type AdminLevel = "reviewer" | "full";
const ADMIN_ROLES: UserRole[] = ["admin_full", "admin_reviewer"];

function roleLevel(role: UserRole): AdminLevel | null {
  if (role === "admin_full") return "full";
  if (role === "admin_reviewer") return "reviewer";
  return null;
}

export async function adminGuard(
  requiredLevel: AdminLevel = "reviewer"
): Promise<GuardOk | GuardFail> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");

  if (origin && host) {
    try {
      const oHost = new URL(origin).host;
      if (oHost !== host) {
        return {
          ok: false,
          res: NextResponse.json({ error: "Bad origin" }, { status: 403 }),
        };
      }
    } catch {
      return {
        ok: false,
        res: NextResponse.json({ error: "Bad origin" }, { status: 403 }),
      };
    }
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("dr_access_token")?.value;

  if (!token) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const payload = verifyAccessToken(token) as AuthJwtPayload | null;
  if (!payload) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!ADMIN_ROLES.includes(payload.role)) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  const lvl = roleLevel(payload.role);
  if (!lvl) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  if (requiredLevel === "full" && lvl !== "full") {
    return {
      ok: false,
      res: NextResponse.json({ error: "Admin full required" }, { status: 403 }),
    };
  }

  return { ok: true, payload };
}

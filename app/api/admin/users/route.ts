// drillrecord/app/api/admin/users/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { adminGuard } from "../_utils";
import { getAdminUsers } from "@/features/admin/server/users";

export async function GET() {
  const guard = await adminGuard();
  if (!guard.ok) return guard.res;

  const users = await getAdminUsers();
  return NextResponse.json({ users });
}

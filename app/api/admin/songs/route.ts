// app/api/admin/songs/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { adminGuard } from "../_utils";
import { getAdminSongs } from "@/features/admin/server/songs";

export async function GET() {
  const guard = await adminGuard();
  if (!guard.ok) return guard.res;

  const songs = await getAdminSongs();
  return NextResponse.json({ songs });
}

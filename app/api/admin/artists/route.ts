// app/api/admin/artists/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { adminGuard } from "../_utils";
import { getAdminArtists } from "@/features/admin/server/artists";

export async function GET() {
  const guard = await adminGuard();
  if (!guard.ok) return guard.res;

  const artists = await getAdminArtists();
  return NextResponse.json({ artists });
}

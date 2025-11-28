// app/api/auth/logout/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { clearAuthCookies } from "../_utils";

export async function POST() {
  const res = NextResponse.json({ success: true });
  clearAuthCookies(res);
  return res;
}

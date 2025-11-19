// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Clear access token
  res.cookies.set("dr_access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",          // MUST match login path
    maxAge: 0,
  });

  // Clear refresh token (note: path must match your login route)
  res.cookies.set("dr_refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",  // same as in login route
    maxAge: 0,
  });

  return res;
}

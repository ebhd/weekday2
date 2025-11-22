// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { zLoginBody } from "@/features/auth/schemas";
import { findUserByEmail } from "@/features/auth/server";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/token";
import { setAuthCookies } from "../_utils";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = zLoginBody.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const userWithHash = await findUserByEmail(email);
  if (!userWithHash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password, userWithHash.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { passwordHash, ...user } = userWithHash;

  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const res = NextResponse.json({ user });
  setAuthCookies(res, accessToken, refreshToken);
  return res;
}

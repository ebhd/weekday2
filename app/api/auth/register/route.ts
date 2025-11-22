import "server-only";
import { NextResponse } from "next/server";
import { zRegisterBody } from "@/features/auth/schemas";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "@/features/auth/server";
import { hashPassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/token";
import { setAuthCookies } from "../_utils";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = zRegisterBody.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, username, password } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    return NextResponse.json(
      { error: "Username already in use" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, username, passwordHash });

  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const res = NextResponse.json({ user });
  setAuthCookies(res, accessToken, refreshToken);
  return res;
}

// features/auth/schemas.ts
import { z } from "zod";

const zEmail = z.email().transform((e) => e.toLowerCase().trim());

export const zRegisterBody = z.object({
  email: zEmail,
  username: z.string().min(3).max(32).trim(),
  password: z.string().min(8).max(128),
});

export const zLoginBody = z.object({
  email: zEmail,
  password: z.string().min(1).max(128),
});

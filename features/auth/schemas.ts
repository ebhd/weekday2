// features/auth/schemas.ts
import { z } from "zod";

export const zRegisterBody = z.object({
  email: z.email(),
  username: z.string().min(3).max(32),
  password: z.string().min(8).max(72),
});

export const zLoginBody = z.object({
  email: z.email(),
  password: z.string().min(1),
});

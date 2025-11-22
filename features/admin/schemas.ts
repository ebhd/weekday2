import { z } from "zod";

export const zAdminSongStatusBody = z.object({
  status: z.enum(["approved", "rejected"]),
});

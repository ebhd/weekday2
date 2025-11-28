// features/reactions/schemas.ts
import { z } from "zod";

export const zReactionType = z.enum(["like", "dislike"]);
export const zReactionBody = z.object({
  reaction: zReactionType,
});

export type ReactionBody = z.infer<typeof zReactionBody>;

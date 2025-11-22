export type ReactionType = "like" | "dislike";

export type SongReactionMap = Record<string, ReactionType | null>;

export type ReactionResponse = {
  songId: string;
  likeCount: number;
  dislikeCount: number;
  userReaction: ReactionType | null;
};

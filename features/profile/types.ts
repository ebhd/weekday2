// features/profile/types.ts

export type UserProfile = {
  id: string;
  email: string;
  username: string;
  createdAt: string;
};

export type UserProfileUpdateInput = {
  username?: string;
};

export type PasswordUpdateInput = {
  currentPassword: string;
  newPassword: string;
};

// --------------------
// Artist profile types
// --------------------
export type ArtistSocials = Record<string, string>;

export type ArtistProfile = {
  id: string;
  userId: string;
  slug: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  socials: ArtistSocials | null;
  status: "pending" | "approved" | "rejected" | "disabled";
  createdAt: string;
};

export type ArtistProfileUpdateInput = {
  slug?: string;
  displayName?: string;
  bio?: string | null;
  socials?: ArtistSocials | null;
};

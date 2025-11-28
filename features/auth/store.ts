// features/auth/store.ts
"use client";

import { create } from "zustand";
import type { AuthUser } from "@/features/auth/types";

type AuthState = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch((err) => console.error("Logout failed", err));

    set({ user: null });
  },
}));

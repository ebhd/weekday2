"use client";

import { useEffect } from "react";
import { useAuthStore } from "./store";
import type { AuthUser } from "./types";

export function AuthHydrator({ user }: { user: AuthUser | null }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [user?.id, user?.email, user?.role, setUser]);

  return null;
}

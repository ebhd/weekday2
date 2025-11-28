// features/notifications/store.ts
"use client";

import { create } from "zustand";
import type { Notification, NotificationVariant } from "./types";

type NotificationState = {
  items: Notification[];
  push: (input: Omit<Notification, "id">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  push: (input) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          id: crypto.randomUUID(),
          durationMs: input.durationMs ?? 3000,
          ...input,
        },
      ],
    })),
  remove: (id) =>
    set((state) => ({
      items: state.items.filter((n) => n.id !== id),
    })),
  clear: () => set({ items: [] }),
}));

export function notify(
  message: string,
  variant: NotificationVariant = "success",
  options?: Omit<Notification, "id" | "message" | "variant">
) {
  useNotificationStore.getState().push({ message, variant, ...options });
}

export function notifySuccess(message: string, description?: string) {
  notify(message, "success", { description });
}

export function notifyError(message: string, description?: string) {
  notify(message, "error", { description, durationMs: 5000 });
}

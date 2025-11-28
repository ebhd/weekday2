// features/notifications/NotificationHost.tsx
"use client";

import { useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { X, CheckCircle2, XCircle } from "lucide-react";
import { useNotificationStore } from "./store";
import type { Notification } from "./types";

function NotificationItem({ n }: { n: Notification }) {
  const remove = useNotificationStore((s) => s.remove);

  useEffect(() => {
    const timeout = setTimeout(() => remove(n.id), n.durationMs ?? 3000);
    return () => clearTimeout(timeout);
  }, [n.id, n.durationMs, remove]);

  const isError = n.variant === "error";

  const colorClasses = isError
    ? "border-red-600 bg-red-600/10 text-red-600 dark:border-red-400 dark:bg-red-400/10 dark:text-red-400"
    : "border-green-600 bg-green-600/10 text-green-600 dark:border-green-400 dark:bg-green-400/10 dark:text-green-400";

  return (
    <Alert
      className={`
        relative flex w-full max-w-sm items-start gap-3
        rounded-md border-l-6 px-3 py-2
        shadow-lg shadow-black/40 backdrop-blur-md
        ${colorClasses}
      `}
    >
      <div className="mt-0.5 shrink-0">
        {isError ? (
          <XCircle className="h-4 w-4" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
      </div>

      <div className="flex-1">
        <AlertTitle className="text-sm font-semibold">
          {isError ? "Something went wrong" : "Success"}
        </AlertTitle>

        {(n.message || n.description) && (
          <AlertDescription className="mt-0.5 text-xs opacity-90">
            {n.message}
            {n.description && (
              <>
                <br />
                <span className="opacity-80">{n.description}</span>
              </>
            )}
          </AlertDescription>
        )}
      </div>

      <button
        onClick={() => remove(n.id)}
        className="ml-2 mt-0.5 rounded-full p-1 hover:bg-white/10 transition"
        aria-label="Dismiss notification"
      >
        <X className="h-3 w-3" />
      </button>
    </Alert>
  );
}

export function NotificationHost() {
  const items = useNotificationStore((s) => s.items);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-2">
      {items.map((n) => (
        <div
          key={n.id}
          className="
            pointer-events-auto
            animate-in fade-in slide-in-from-top-4
            duration-200
          "
        >
          <NotificationItem n={n} />
        </div>
      ))}
    </div>
  );
}

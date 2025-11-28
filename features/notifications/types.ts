export type NotificationVariant = "success" | "error";

export type Notification = {
  id: string;
  message: string;
  description?: string;
  variant: NotificationVariant;
  durationMs?: number; // defaults to 3000
};

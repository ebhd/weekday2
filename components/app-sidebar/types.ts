import type { Icon } from "@tabler/icons-react";

export type SidebarNavItem = {
  title: string;
  url: string;
  icon: string; // ← string, not component
};

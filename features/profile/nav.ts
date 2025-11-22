import {
  IconDashboard,
  IconListDetails,
  IconUsers,
  IconFileDescription,
  IconMusic,
  IconUser,
  IconMicrophone2,
} from "@tabler/icons-react";
import type { SidebarNavItem } from "@/components/app-sidebar/types";
import type { UserRole } from "@/features/auth/types";

export function getAdminNav(): SidebarNavItem[] {
  return [
    { title: "Dashboard", url: "/admin", icon: "dashboard" },
    { title: "Data Tables", url: "/admin/tables", icon: "list" },
    { title: "Team", url: "/admin/team", icon: "users" },
    { title: "Submits", url: "/admin/submits", icon: "file" },
  ];
}

export function getArtistNav(): SidebarNavItem[] {
  return [
    { title: "Profile", url: "/profile", icon: "user" },
    { title: "My Songs", url: "/profile/songs", icon: "music" },
  ];
}

export function getUserNav(): SidebarNavItem[] {
  return [
    { title: "Profile", url: "/profile", icon: "user" },
    { title: "Be an Artist", url: "/profile/beartist", icon: "mic" },
  ];
}

export function getDashboardNav(role: UserRole): SidebarNavItem[] {
  if (role === "artist") return getArtistNav();
  return getUserNav();
}

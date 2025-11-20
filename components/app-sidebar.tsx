"use client";

import * as React from "react";
import {
  IconDashboard,
  IconFileDescription,
  IconFileWord,
  IconListDetails,
  IconReport,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import Image from "next/image";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/dist/client/link";

const data = {
  user: {
    name: "Napeleon",
    email: "hdida@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Data Tables",
      url: "/admin/tables",
      icon: IconListDetails,
    },
    {
      title: "Team",
      url: "/admin/team",
      icon: IconUsers,
    },
    {
      title: "Submits",
      url: "/admin/submits",
      icon: IconFileDescription,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image
                  src="/drillrecord.png"
                  alt="drillrecords logo"
                  width={100}
                  height={50}
                  className="mr-4"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="py-8">
        <NavMain items={data.navMain} catTitle={"Dashboard"} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

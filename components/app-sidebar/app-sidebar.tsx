"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { NavMain } from "@/components/nav-main";
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

import type { SidebarNavItem } from "@/components/app-sidebar/types";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  navItems: SidebarNavItem[];
  catTitle: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  showUserFooter?: boolean;
};

export function AppSidebar({
  navItems,
  catTitle,
  user,
  showUserFooter = true,
  ...props
}: AppSidebarProps) {
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
                  alt="The Weekday logo"
                  width={100}
                  height={50}
                  className="mr-4"
                  priority
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-8">
        <NavMain items={navItems} catTitle={catTitle} />
      </SidebarContent>

      {showUserFooter && user && (
        <SidebarFooter>
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.avatar ?? "/default-avatar.png",
            }}
          />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

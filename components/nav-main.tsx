"use client";

import {
  IconCirclePlusFilled,
  IconMail,
  IconMap,
  type Icon,
} from "@tabler/icons-react";
import Link from "next/dist/client/link";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconFileDescription,
  IconListDetails,
  IconMicrophone2,
  IconMusic,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: IconDashboard,
  list: IconListDetails,
  users: IconUsers,
  file: IconFileDescription,
  music: IconMusic,
  user: IconUser,
  mic: IconMicrophone2,
};

export function NavMain({
  items,
  catTitle,
}: {
  items: {
    title: string;
    url: string;
    icon?: string;
  }[];
  catTitle: string;
}) {
  console.log(items);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <h2 className="font-display text-xl">{catTitle}</h2>
          {items.map((item) => {
            const IconComp = item.icon ? iconMap[item.icon] : null;

            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    tooltip={item.title}
                  >
                    {IconComp && <IconComp className="size-5" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

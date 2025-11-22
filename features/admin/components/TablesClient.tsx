"use client";

import * as React from "react";
import type {
  AdminUserRow,
  AdminArtistRow,
  AdminSongRow,
} from "@/features/admin/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTable } from "@/features/admin/components/tables/UsersTable";
import { ArtistsTable } from "@/features/admin/components/tables/ArtistsTable";
import { SongsTable } from "@/features/admin/components/tables/SongsTable";

export function TablesClient(props: {
  users: AdminUserRow[];
  artists: AdminArtistRow[];
  songs: AdminSongRow[];
}) {
  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="artists">Artists</TabsTrigger>
        <TabsTrigger value="songs">Songs</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <UsersTable initial={props.users} />
      </TabsContent>

      <TabsContent value="artists">
        <ArtistsTable initial={props.artists} />
      </TabsContent>

      <TabsContent value="songs">
        <SongsTable initial={props.songs} />
      </TabsContent>
    </Tabs>
  );
}

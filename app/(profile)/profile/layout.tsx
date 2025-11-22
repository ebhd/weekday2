import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { getDashboardNav } from "@/features/profile/nav";
import { getArtistProfileByUserId } from "@/features/profile/server/artists";

export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?returnTo=/profile");
  }
  let artist = null;
  if (user.role === "artist") {
    artist = await getArtistProfileByUserId(user.id);
  }
  const navItems = getDashboardNav(user.role);

  return (
    <div className="font-sans">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar
          variant="inset"
          navItems={navItems}
          catTitle="Dashboard"
          user={{
            name: user.email.split("@")[0],
            email: user.email,
            avatar: artist?.avatarUrl || "/avatars/shadcn.jpg",
          }}
        />

        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">{children}</div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

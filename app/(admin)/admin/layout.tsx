import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { getAdminNav } from "@/features/profile/nav";

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const userProfile = await getCurrentUser();
  if (!user || !user.role.startsWith("admin")) {
    redirect("/login?returnTo=/admin");
  }

  const navItems = getAdminNav();

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
          catTitle="Admin"
          user={{
            name: user.email.split("@")[0],
            email: user.email,
            avatar: "/avatars/shadcn.jpg",
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

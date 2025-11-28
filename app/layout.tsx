import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { NotificationHost } from "@/features/notifications/NotificationHost";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { AuthHydrator } from "@/features/auth/AuthHydrator";

config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "weekday",
  description: "A app to Support underground artists.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className=" text-white">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased  overflow-x-hidden scroll-smooth`}
      >
        <AuthHydrator user={user} />
        {children}
        <NotificationHost />
      </body>
    </html>
  );
}

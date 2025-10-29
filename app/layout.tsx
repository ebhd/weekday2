import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drillrecord",
  description: "A app to record and track your drilling practice sessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-(--background) text-(--foreground)">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

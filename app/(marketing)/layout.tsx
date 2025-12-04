import "../globals.css";
import { defaultSEO } from "@/config/seo";
import { Navbar } from "@/components/core/Navbar/Navbar";
import { BackgroundFx } from "@/components/core/BackgroundFx";
import { Footer } from "@/components/core/Footer";

export const metadata = {
  title: defaultSEO.title,
  description: defaultSEO.description,
};

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundFx />

      <div className="xl:px-48 lg:px-20 md:px-10 px-4">
        <Navbar />
      </div>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}

import "../globals.css";
import { defaultSEO } from "@/config/seo";
import { Navbar } from "@/components/core/Navbar";
import { BackgroundFx } from "@/components/core/BackgroundFx";

export const metadata = {
  title: defaultSEO.title,
  description: defaultSEO.description,
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <BackgroundFx />
      <div className="md:px-48 px-4">
        <Navbar />
      </div>
      {children}
    </div>
  );
}

import { defaultSEO } from "@/config/seo";

export const metadata = {
  title: defaultSEO.title,
  description: defaultSEO.description,
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

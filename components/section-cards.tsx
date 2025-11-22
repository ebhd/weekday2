import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminStats } from "@/features/admin/types";

function StatsCard(props: {
  title: string;
  value: string;
  subtitle?: string;
  description: string;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{props.title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {props.value}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {props.subtitle}
        </div>
        <div className="text-muted-foreground">{props.description}</div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards({ stats }: { stats: AdminStats }) {
  const { totalVisitors, totalAccounts, totalAdmins, totalArtists } = stats;

  const adminsPct = totalAccounts
    ? ((totalAdmins / totalAccounts) * 100).toFixed(1)
    : "0";

  const artistsPct = totalAccounts
    ? ((totalArtists / totalAccounts) * 100).toFixed(1)
    : "0";

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StatsCard
        title="Total Visitors"
        value={totalVisitors.toLocaleString()}
        subtitle="Total visitors of drillrecord.com"
        description="Mobile & desktop visitors included"
      />
      <StatsCard
        title="Total Accounts"
        value={totalAccounts.toLocaleString()}
        subtitle="Total accounts registered"
        description="Admins, artists & users included"
      />
      <StatsCard
        title="Total Admins"
        value={totalAdmins.toLocaleString()}
        subtitle={`${adminsPct}% of total accounts`}
        description="Admins + admin reviewers"
      />
      <StatsCard
        title="Total Artists"
        value={totalArtists.toLocaleString()}
        subtitle={`${artistsPct}% of total accounts`}
        description="Approved artists only"
      />
    </div>
  );
}

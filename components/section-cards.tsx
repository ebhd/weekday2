import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stats } from "fs";

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

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StatsCard
        title="Total Visitors"
        value="32,000"
        subtitle="Total visitor of drillrecord.com"
        description="Mobile & Desktop visitors included"
      />
      <StatsCard
        title="Total Accounts"
        value="32,000"
        subtitle="Total accounts registered"
        description="Admins & Artists & Users included"
      />
      <StatsCard
        title="Total Admins "
        value="32,000"
        subtitle="31.2% of the total accounts"
        description="Admins and Admins Reviewers included"
      />
      <StatsCard
        title="Total Artiests "
        value="32,000"
        subtitle="30.2% of the total accounts"
        description="Admins and Admins Reviewers included"
      />
    </div>
  );
}

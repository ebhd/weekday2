import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Mic2, Users } from "lucide-react";
import { TextBar } from "@/components/core/TextBar";

export default function WebinarPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-foreground ">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:px-6 lg:py-16">
        <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-72" />

        <section className="space-y-6">
          <TextBar text="Webinar • The Weekday" icon></TextBar>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              TikTok, algorithms & the underground
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-muted-fg)] md:text-base">
              In this webinar, the team behind{" "}
              <span className="text-[var(--color-primary)]">The Weekday</span>{" "}
              talks about five forces that shape underground music today:
              TikTok, social media algorithms, streaming platforms, gatekeeping,
              and why so many promising artists disband early.
            </p>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
          <Card className="border-[var(--color-border)] bg-[var(--color-surface)]/95 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs text-[var(--color-muted-fg)]">
                  <Mic2 className="h-4 w-4" />
                  <span>Founders&apos; conversation</span>
                </div>
                <h2 className="text-base font-semibold md:text-lg">
                  Watch the webinar
                </h2>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black/50">
                <video
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                >
                  <source src="/web.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between border-[var(--color-border)] bg-[var(--color-surface)]/95">
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">Webinar overview</h3>
                <p className="text-xs text-[var(--color-muted-fg)]">
                  Yasmine, Ebrahim, Dries, Alfie and Ilias discuss how modern
                  platforms shape the underground scene from viral TikToks to
                  streaming payouts and industry gatekeeping.
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-xs md:text-[13px]">
                <div className="space-y-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/60 p-3">
                  <dt className="flex items-center gap-2 text-[var(--color-muted-fg)]">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Duration
                  </dt>
                  <dd className="text-sm font-medium">≈ 5–10 minutes</dd>
                </div>

                <div className="space-y-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/60 p-3">
                  <dt className="flex items-center gap-2 text-[var(--color-muted-fg)]">
                    <Mic2 className="h-3.5 w-3.5" />
                    Format
                  </dt>
                  <dd className="text-sm font-medium">Video</dd>
                </div>

                <div className="space-y-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/60 p-3">
                  <dt className="flex items-center gap-2 text-[var(--color-muted-fg)]">
                    <Users className="h-3.5 w-3.5" />
                    Speakers
                  </dt>
                  <dd className="text-sm font-medium">Team The Weekday</dd>
                </div>

                <div className="space-y-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/60 p-3">
                  <dt className="flex items-center gap-2 text-[var(--color-muted-fg)]">
                    Focus
                  </dt>
                  <dd className="text-sm font-medium">
                    TikTok, algorithms &amp; survival
                  </dd>
                </div>
              </dl>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--color-muted-fg)]">
                  What this webinar covers
                </p>
                <ul className="space-y-1.5 text-xs leading-relaxed text-[var(--color-muted-fg)]">
                  <li>
                    • How TikTok can launch or flatten underground tracks.
                  </li>
                  <li>
                    • Why algorithms don&apos;t always surface real talent.
                  </li>
                  <li>
                    • When streaming platforms help or drain underground scenes.
                  </li>
                  <li>• How gatekeeping pushes away new fans and money.</li>
                  <li>
                    • Why many underground acts disband after just a few
                    releases.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 px-5 py-6 md:grid-cols-2 md:px-7">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold md:text-base">
              In 10 minutes, we walk through
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed text-[var(--color-muted-fg)]">
              <li>
                <span className="font-medium text-foreground">
                  TikTok&apos;s impact:
                </span>{" "}
                short-form virality vs. building a real fanbase and community.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Algorithm bias:
                </span>{" "}
                how platforms push engagement, not necessarily quality or
                originality.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Streaming economics:
                </span>{" "}
                what low payouts mean for underground artists trying to survive.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Gatekeeping:
                </span>{" "}
                why &quot;protecting the scene&quot; often kills growth and
                business for niche artists.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Early disbanding:
                </span>{" "}
                how financial pressure and social media burnout make artists
                quit, even when the music is strong.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Where The Weekday fits:
                </span>{" "}
                why we focus on structured rankings and community input instead
                of pure algorithms.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold md:text-base">
              Who this is for
            </h3>
            <p className="text-xs text-[var(--color-muted-fg)]">
              This webinar is for people who actually care about the future of
              the underground: the artists making the music, the fans
              discovering it early, and the partners trying to build something
              sustainable around it.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Underground artists & bands",
                "Rappers, singers & vocalists",
                "Producers & engineers",
                "Playlist curators & DJs",
                "Managers & indie labels",
                "Scene supporters & early fans",
              ].map((audience) => (
                <span
                  key={audience}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/80 px-3 py-1 text-[11px] text-[var(--color-muted-fg)] hover:border-[var(--color-primary)] hover:text-foreground"
                >
                  {audience}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

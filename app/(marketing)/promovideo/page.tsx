import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PromoVideoPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] mb-16">
      <div className="relative mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-12">
        {/* glow */}

        {/* Header */}
        <header className="space-y-4">
          <Badge className="border-0 bg-[rgba(64,255,80,0.08)] text-xs font-medium text-[var(--color-primary)] p-2 px-4">
            Promo • The Weekday
          </Badge>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight font-display">
            Onze officiële{" "}
            <span className="text-[var(--color-primary)] font-display">
              promovideo
            </span>
          </h1>

          <p className="text-sm md:text-base text-[var(--color-muted-fg)] max-w-xl">
            In deze korte reclamespot van 30 seconden stellen wij The Weekday
            voor: een platform dat structuur brengt in underground muziek,
            artiesten zichtbaarheid geeft en luisteraars helpt nieuwe talenten
            te ontdekken.
          </p>
        </header>

        {/* Video */}
        <section className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black/40 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
            <video className="h-full w-full object-cover" controls playsInline>
              <source src="/promo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted-fg)] text-center">
            Video geproduceerd door team The Weekday
          </p>
        </section>
      </div>
    </main>
  );
}

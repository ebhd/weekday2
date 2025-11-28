import { BackgroundFx } from "@/components/core/BackgroundFx";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="flex w-full flex-col h-72 lg:h-[28rem] items-center justify-center text-center font-display">
      <div className="z-10 text-[1.8rem]/[1.1] text-white lg:text-7xl ">
        <h1>Ranking The Underground</h1>
        <h1>Drill Scene Worldwide</h1>
      </div>
      <div>
        <p className="mt-1 max-w-2xl text-xs lg:text-base px-5 text-muted-fg font-sans">
          Discover, rate, and share the best drill music from around the globe.
          Join our community of drill enthusiasts and elevate your music
          experience.
        </p>
      </div>

      <div className="mt-4 flex  space-y-2 lg:flex-row space-x-4 ">
        <Button size="lg" variant="default" asChild>
          <Link href="#ranking-table">Explore ranking</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/register">Create an account</Link>
        </Button>
      </div>
    </section>
  );
}

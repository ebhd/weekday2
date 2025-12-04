import { BackgroundFx } from "@/components/core/BackgroundFx";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/currentUser";
import Link from "next/link";

export async function Hero() {
  const user = await getCurrentUser();

  return (
    <section className="flex w-full flex-col h-72 lg:h-[28rem] items-center justify-center text-center font-display">
      <div className="z-10 text-[1.8rem]/[1.1] text-white lg:text-7xl ">
        <h1>Ranking The Underground</h1>
        <h1>Music Scene Worldwide</h1>
      </div>
      <div>
        <p className="mt-1 max-w-2xl text-xs lg:text-base px-5 text-muted-fg font-sans">
          Discover, rate, and share the best music from around the globe.
          Join our community of music enthusiasts and elevate your music
          experience.
        </p>
      </div>

      <div className="mt-4 flex  space-y-2 lg:flex-row space-x-4 ">
        <Button size="lg" variant="default" asChild>
          <Link href="#ranking-table">Explore ranking</Link>
        </Button>

        {!user ? (
          <Button size="lg" variant="outline" asChild>
            <Link href="/register">Create an account</Link>
          </Button>
        ) : user.role === "user" ? (
          <Button size="lg" variant="outline" asChild>
            <Link href="/profile">Be an Artist</Link>
          </Button>
        ) : user.role === "artist" ? (
          <Button size="lg" variant="outline" asChild>
            <Link href="/profile">My Profile</Link>
          </Button>
        ) : user.role === "admin_full" || user.role === "admin_reviewer" ? (
          <Button size="lg" variant="outline" asChild>
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

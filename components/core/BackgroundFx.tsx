import Image from "next/image";

export function BackgroundFx() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[1200px] z-0 overflow-hidden"
    >
      {/* Green radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(3300px_1100px_at_50%_-10%,_rgba(64,255,80,0.25),_transparent_35%)] opacity-30" />

      {/* Background image */}
      <div className="absolute inset-0 lg:opacity-2 opacity-5">
        <Image
          src="/backgroundHero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-background/40 to-background" />

      {/* Optional noise texture */}
      {/* <div
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{ backgroundImage: 'url(/images/noise-512.png)' }}
      /> */}
    </div>
  );
}

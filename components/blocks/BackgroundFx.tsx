import Image from "next/image";

export function BackgroundFx() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Green radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(3300px_1100px_at_50%_-10%,_rgba(64,255,80,0.25),_transparent_35%)] opacity-20" />

      {/* Background image */}
      <div className="absolute inset-0 opacity-1">
        <Image
          src="/backgroundHero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Optional noise texture */}
      {/* <div
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{ backgroundImage: 'url(/images/noise-512.png)' }}
      /> */}
    </div>
  );
}

import Image from "next/image";

export function BackgroundFx() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(3300px_1100px_at_50%_-10%,_rgba(64,255,80,0.25),_transparent_35%)] opacity-20" />

      <div className="absolute inset-0 opacity-[0.6%]">
        <Image
          src="/backgroundHero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* <div className="absolute inset-0 opacity-[.07] mix-blend-overlay"
           style={{ backgroundImage: 'url(/images/noise-512.png)' }} /> */}
    </div>
  );
}

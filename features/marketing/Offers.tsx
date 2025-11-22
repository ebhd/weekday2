import { TextBar } from "@/components/core/TextBar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

function FeatureItem({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-start gap-6">
      <span className="font-display text-5xl lg:text-7xl">{index}</span>

      <div className="flex flex-col font-sans text-3xl font-extralight">
        <h3 className="text-xl lg:text-3xl font-extralight">{title}</h3>
        <p className="mt-2 text-xs lg:text-sm text-muted-fg max-w-xl">
          {children}
        </p>
      </div>
    </div>
  );
}
export function OffersGradient() {
  return (
    <>
      {/* MAIN WHITE GLOW */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
      >
        <div
          style={{
            width: "min(96rem, calc(100vw - 2rem))",
            height: "min(58rem, calc((100vw - 2rem) * 0.604))",
            position: "relative",
            maxWidth: "96rem",
            maxHeight: "58rem",
            margin: "0 auto",
          }}
        >
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              width: "100%",
              height: "100%",
              background:
                "radial-gradient(circle at center," +
                "rgba(255,255,255,0.10) 0%," +
                "rgba(255,255,255,0.08) 20%," +
                "rgba(255,255,255,0.0) 40%," +
                "rgba(255,255,255,0.02) 60%," +
                "transparent 80%)",
              filter: "blur(72px)",
            }}
          />
        </div>
      </div>

      {/* GREEN SIDE GLOW – */}
      <div
        aria-hidden
        className="hidden lg:block absolute right-[-50%] top-1/2 -translate-y-1/2 pointer-events-none z-0"
      >
        <div
          style={{
            width: "65rem",
            height: "25rem",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle at center, rgba(64,255,80,0.25) 0%, rgba(64,255,80,0.15) 15%, rgba(64,255,80,0.05) 30%, transparent 100%)",
            filter: "blur(50px)",
          }}
        />
      </div>
    </>
  );
}

export function Offers() {
  const features = [
    {
      index: ".1",
      title: "Discover Artist",
      text: "Find fresh drill fast — verified profiles, real links, and tracks you can stream instantly.",
    },
    {
      index: ".2",
      title: "Trust The Charts",
      text: "Every upload is reviewed before it counts. Transparent scoring and bot-resistant rankings you can believe.",
    },
    {
      index: ".3",
      title: "Join The Rise",
      text: "Follow your favorites, share the best, and watch new names climb in real time.",
    },
  ];

  return (
    <section
      aria-labelledby="offers-heading"
      className="relative mt-28 lg:mt-52 flex flex-col lg:flex-row lg:gap-72 items-center"
    >
      <OffersGradient />

      <div className="flex flex-col z-10">
        <TextBar text="What do we offer?" />

        <h2
          id="offers-heading"
          className="text-2xl text-center font-display font-light my-4 lg:text-left lg:text-5xl"
        >
          We have everything you need <br /> to start and grow.
        </h2>

        <Separator className="my-8 w-full!" />

        {features.map((f) => (
          <div key={f.index}>
            <FeatureItem index={f.index} title={f.title}>
              {f.text}
            </FeatureItem>
            <Separator className="my-8 w-full!" />
          </div>
        ))}
      </div>

      <figure className="m-0  opacity-80 z-20 ml-8 mb-5 ">
        <Image
          src="/MicWhite.png"
          alt="Extra visuals, Microphone image on stand"
          width={500}
          height={500}
          priority
          className="object-cover y lg:block hidden "
        />
      </figure>
    </section>
  );
}

import { SongPlayer } from "@/features/ranking/components/RankingTableParts/SongPlayer";
import { TextBar } from "@/components/core/TextBar";
export default function InterviewPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <main className="relative mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-12">
        <header className="space-y-4">
          <TextBar text="Interview • The Weekday"></TextBar>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight font-display">
            Interview met{" "}
            <span className="text-[var(--color-primary)]">Paul Cailly</span>
          </h1>

          <p className="text-sm md:text-base text-[var(--color-muted-fg)] max-w-xl">
            Voor The Weekday spraken we met{" "}
            <span className="text-[var(--color-foreground)] font-medium">
              Paul Cailly
            </span>
            , Software Engineer bij Deezer in Parijs – één van de grote
            internationale muziekstreamingplatformen. Al meer dan zes jaar werkt
            hij aan de frontend, partnerintegraties en de Deezer-ervaring op
            Smart TV&apos;s, smart speakers en Chromecast. Hij gaf ons concrete
            tips over hoe je een muziekplatform ontwerpt, test en laat groeien.
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] text-[var(--color-muted-fg)]">
            <span className="rounded-full border border-[var(--color-border)] bg-black/30 px-3 py-1">
              Software Engineer @ Deezer
            </span>
            <span className="rounded-full border border-[var(--color-border)] bg-black/30 px-3 py-1">
              Frontend & partnerships
            </span>
            <span className="rounded-full border border-[var(--color-border)] bg-black/30 px-3 py-1">
              React / JS / TS
            </span>
          </div>
        </header>

        {/* Rij 1: wie + audio */}
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.2fr)] items-start">
          {/* Wie + waarom */}
          <div className="space-y-4 border-l border-[var(--color-border)] pl-5">
            <h2 className="text-lg md:text-xl font-semibold">
              Wie hebben we geïnterviewd?
            </h2>
            <ul className="space-y-2 text-sm md:text-base text-[var(--color-muted-fg)]">
              <li>
                <span className="font-medium text-[var(--color-foreground)]">
                  Naam:
                </span>{" "}
                Paul Cailly
              </li>
              <li>
                <span className="font-medium text-[var(--color-foreground)]">
                  Rol:
                </span>{" "}
                Software Engineer bij Deezer (partnership team – Smart TV,
                Chromecast, telecombundels)
              </li>
              <li>
                <span className="font-medium text-[var(--color-foreground)]">
                  Extra:
                </span>{" "}
                freelance developer, docent avondlessen voor volwassenen die
                naar IT willen overstappen, en winnaar van meerdere hackathons
                (o.a. React Europe, interne Deezer GenAI hackathon).
              </li>
              <li>
                <span className="font-medium text-[var(--color-foreground)]">
                  Waarom hij?
                </span>{" "}
                hij combineert muziek, product thinking, full-stack
                webdevelopment en ervaring met grote gebruikersaantallen.
              </li>
            </ul>

            <div className="pt-3 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-fg)]">
                Waarom dit interview belangrijk was
              </h3>
              <p className="text-sm md:text-base text-[var(--color-muted-fg)]">
                Wij bouwen een platform voor underground artiesten. Paul werkt
                dagelijks aan echte muziekproducten. Zijn ervaring hielp ons
                nadenken over{" "}
                <span className="text-[var(--color-foreground)]">
                  welke features The Weekday nodig heeft
                </span>{" "}
                en hoe je die op een slimme manier valideert.
              </p>
            </div>
          </div>

          {/* Audio */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-semibold">
              Audiofragment uit het interview
            </h2>
            <p className="text-sm md:text-base text-[var(--color-muted-fg)]">
              In dit fragment praten we over{" "}
              <span className="text-[var(--color-foreground)]">
                het kiezen van features samen met je community
              </span>{" "}
              in plaats van alleen op je eigen ideeën te vertrouwen.
            </p>

            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-hover)]/80 px-4 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.7)]">
              <SongPlayer url="/interview.mp3" height={56} />
            </div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-fg)]">
              Met toestemming opgenomen en gepubliceerd
            </p>
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-border)]/80 to-transparent" />

        {/* Rij 2: wat geleerd + transcriptie */}
        <section className="grid gap-10 md:grid-cols-2 items-start">
          {/* Wat geleerd */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-semibold">
              Wat hebben we geleerd?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-[var(--color-muted-fg)]">
              <li>
                Begin niet bij losse features, maar bij{" "}
                <span className="text-[var(--color-foreground)]">
                  het probleem van je gebruikers en je community
                </span>
                .
              </li>
              <li>
                Leg zo snel mogelijk{" "}
                <span className="text-[var(--color-foreground)]">
                  een prototype of vroege versie
                </span>{" "}
                (bv. Figma of demo) in de handen van echte gebruikers en praat
                met hen.
              </li>
              <li>
                Bouw als student{" "}
                <span className="text-[var(--color-foreground)]">
                  eigen projecten
                </span>{" "}
                en vertrouw niet te veel op AI: je moet zelf leren debuggen en
                begrijpen wat je code doet.
              </li>
              <li>
                Coding is maar een deel van het werk –{" "}
                <span className="text-[var(--color-foreground)]">
                  communicatie, samenwerken en requirements begrijpen
                </span>{" "}
                zijn minstens even belangrijk.
              </li>
            </ul>

            <p className="pt-2 text-sm md:text-base text-[var(--color-muted-fg)]">
              Door zijn advies kozen wij voor{" "}
              <span className="text-[var(--color-foreground)]">
                ranking, artists profiles, song profiles, login, likes &
                comments en uploaden
              </span>{" "}
              als basis van The Weekday, en lieten we die valideren door mensen
              uit onze eigen scene.
            </p>
          </div>

          {/* Transcriptie */}
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold">
              Transcriptie van het belangrijkste fragment
            </h2>
            <p className="text-sm md:text-base text-[var(--color-muted-fg)]">
              Dit stuk raakte ons het meest, omdat het perfect past bij ons
              project:
            </p>
            <div className="relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-hover)]/80 p-5 text-sm leading-relaxed shadow-[0_18px_40px_rgba(0,0,0,0.7)]">
              <span
                aria-hidden
                className="absolute -top-4 left-6 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-primary)] text-lg"
              >
                “
              </span>
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-fg)] pl-6">
                Vrij vertaald naar het Nederlands
              </p>
              <p className="text-[var(--color-foreground)] pl-6">
                Je gebruikers hebben bijna altijd het antwoord. Jullie eerste
                focus zou moeten zijn om{" "}
                <span className="font-semibold">
                  zo snel mogelijk een versie van je product in hun handen te
                  krijgen
                </span>
                , zelfs al is het maar een simpel prototype.
                <br />
                <span className="block mt-2">
                  Praat met hen, vraag: ‘Wat mis je vandaag? Waar loop je vast?
                  Wat zou jou écht helpen?’
                </span>
                <br />
                Als je te veel vertrouwt op je eigen aannames &#40;of alleen op
                AI&#41;, ga je makkelijk de verkeerde richting uit. De community
                geeft je de beste input om het juiste product te bouwen.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

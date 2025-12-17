import { TextBar } from "@/components/core/TextBar";
import { Separator } from "@/components/ui/separator";

function AboutItem({
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
      {/* BIG INDEX */}
      <span className="font-display text-4xl sm:text-5xl lg:text-6xl opacity-80">
        {index}
      </span>

      {/* TEXT BLOCK */}
      <div className="flex flex-col">
        <h3 className="font-display text-lg sm:text-xl lg:text-2xl font-light">
          {title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm lg:text-base text-muted-fg max-w-xl font-sans">
          {children}
        </p>
      </div>
    </div>
  );
}

export default function About() {
  const items = [
    {
      index: ".1",
      title: "Website voor makers",
      text: "We geven artiesten een plek om hun werk te tonen en zichtbaar te worden in een scene die vaak verborgen blijft.",
    },
    {
      index: ".2",
      title: "Creatieve verhalen",
      text: "We delen de achtergrond, visie en het proces achter de artiesten die onze community vormen.",
    },
    {
      index: ".3",
      title: "Community & support",
      text: "We bouwen een hechte community waar makers elkaar inspireren, ondersteunen en samen groeien.",
    },
    {
      index: ".4",
      title: "Ruimte voor groei",
      text: "We creëren een website waar verhalen, projecten en talent van opkomende artiesten kunnen ontwikkelen.",
    },
  ];

  return (
    <section className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-16 relative">
      <div className="max-w-4xl w-full space-y-12 z-10">
        <header className="flex flex-col items-center text-center space-y-4">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl">
            Over ons
          </h1>
          <TextBar
            text="Wij geloven dat talent niet altijd mainstream hoeft te zijn om gezien te worden."
            icon
          />
        </header>

        <p className="leading-relaxed text-sm sm:text-base md:text-lg font-sans text-center lg:text-left opacity-90">
          Onze website is een digitale ruimte voor underground artiesten:
          muzikanten, artiesten, performers en iedereen met een creatieve stem.
          Te vaak verdwijnen vernieuwende makers in de schaduw omdat ze niet
          passen binnen het commerciële plaatje of de middelen missen om ontdekt
          te worden. Wij willen dat veranderen.
        </p>

        <div className="space-y-10">
          {items.map((it) => (
            <div key={it.index}>
              <AboutItem index={it.index} title={it.title}>
                {it.text}
              </AboutItem>
              <Separator className="my-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

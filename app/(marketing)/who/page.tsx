"use client";

import Image from "next/image";
import { TextBar } from "@/components/core/TextBar";
import { SongPlayer } from "@/features/ranking/components/RankingTableParts/SongPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

type TeamMember = {
  name: string;
  role: string;
  description: string;
  imageSrc: string;
  linkedinUrl: string;
  strengths: string[];
};

const team: TeamMember[] = [
  {
    name: "Ebrahim Hdida",
    role: "Full-Stack Developer",
    description:
      "Ik ben een software engineer met een passie voor technologie, design en muziekcultuur. Ik bouw platforms die artiesten helpen zich te uiten en nieuwe doelgroepen te bereiken, en zet met mijn achtergrond in toegepaste informatica ideeën om in sterke digitale ervaringen voor de undergroundscene.",
    imageSrc: "/team/ebrahim.jpg",
    linkedinUrl: "https://www.linkedin.com/in/ebrahim-hdida",
    strengths: ["Ideeën", "Doorzetten", "Creatief"],
  },
  {
    name: "Alfie Vercammen",
    role: "Project Coordinator",
    description:
      "I have a strong interest in programming, data and everything related to technology. For me writing code kind of feels like writing a track, experimenting, layering ideas and fine tuning until everything falls in place. I love working on projects where I can mix logic with creativity, turning logical problems into something that flows.",
    imageSrc: "/team/alfie.jpg",
    linkedinUrl:
      "https://www.linkedin.com/in/alfie-ferrolino-vercammen-226b41342/",
    strengths: ["Plannen", "Samenwerken", "Overzicht"],
  },
  {
    name: "Illias Benabdellah",
    role: "BResearch and content",
    description:
      "Ik ben Ilias Ben Abdellah. Ik ben niet de grootste prater en ik hoef ook niet per se mijn mening door te drukken. Ik ben meer van het gewoon doen, zorgen dat dingen gebeuren zonder al te veel gedoe. Precies daarom spreekt de underground scene me aan. De artiesten zijn vaak mensen die gefocust zijn op hun werk. Het draait niet om streams of geld, maar vooral om de drang om iets te maken.",
    imageSrc: "/team/illias.jpg",
    linkedinUrl: "https://www.linkedin.com/",
    strengths: ["Zoeken", "Schrijven", "Rustig"],
  },
  {
    name: "Yasmine Rahou",
    role: "Project Manager (SPOC)",
    description:
      "Ik ben Yasmine, een grote liefhebber van upcoming artists en nieuwe sounds. Ik vind het het heel belangrijk om nieuwe talenten te ontdekken, hun vibe te begrijpen en hun verhaal een plek te geven op onze website. Altijd op zoek naar nieuwe genres en een interessante aanpak op muziek!",
    imageSrc: "/team/yasmine.jpg",
    linkedinUrl: "https://www.linkedin.com/in/yasmine-rahou-07b014399/",
    strengths: ["Communicatie", "Leiden", "Vriendelijk"],
  },
  {
    name: "Dries vanderstukken",
    role: "Quality Control",
    description:
      "Sinds kinds af aan ben ik al gepassioneerd in het bedenken en creëren van programma's en software. Er is niets zo leuk als technische problemen op een creatieve en logische wijze op te lossen, en zo een werkend eindproduct te krijgen. Dat is dus ook mijn job binnen The Weekday: problemen vinden, en die oplossen. Zo zorg ik ervoor dat alles up-to-standard blijft voor een mooi resultaat.",
    imageSrc: "/team/dries.jpg",
    linkedinUrl: "https://www.linkedin.com/",

    strengths: ["Nauwkeurig", "Problemen vinden", "Oplossen"],
  },
];

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5/10 backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/10">
      <CardContent className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-18 sm:h-20 sm:w-20 rounded-full overflow-hidden border border-white/20 bg-white/5">
            <Image
              src={member.imageSrc}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display text-base sm:text-lg truncate">
                  {member.name}
                </h3>
                <p className="text-[0.65rem] sm:text-xs uppercase tracking-wide text-muted-fg">
                  {member.role}
                </p>
              </div>

              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition"
                aria-label={`Bekijk ${member.name} op LinkedIn`}
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-sm" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[0.65rem] sm:text-[0.7rem]">
          {member.strengths.map((s) => (
            <span
              key={s}
              className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-muted-fg"
            >
              {s}
            </span>
          ))}
        </div>

        <Separator className="bg-white/10" />

        <p className="text-xs sm:text-sm text-muted-fg leading-relaxed">
          {member.description}
        </p>
      </CardContent>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition"
      >
        <div className="absolute -inset-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
      </div>
    </Card>
  );
}

export default function WieIsWiePage() {
  return (
    <section className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-6xl space-y-10">
        <header className="flex flex-col items-center text-center space-y-4">
          <TextBar text="Wie is wie?" />
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl">
            De crew achter het platform
          </h1>
          <p className="max-w-2xl text-xs sm:text-sm md:text-base text-muted-fg font-sans">
            Ons team bestaat uit gedreven makers met specialisaties in
            ontwikkeling, design en strategie.
          </p>
        </header>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

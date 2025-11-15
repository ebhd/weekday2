import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faHeart,
  faCrown,
  faCalendarDays,
  faCloudArrowUp,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import type { Artist } from "@/features/artists/types";
import type { Song } from "@/features/songs/types";

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function ArtistProfileSection({
  artist,
  songs,
}: {
  artist: Artist;
  songs: Song[];
}) {
  return (
    <section className="mx-auto w-full max-w-6xl rounded-3xl bg-surface/95 border border-white/10 shadow-lg shadow-black/20 my-20">
    

      <div className="px-6 sm:px-8 lg:px-10 pb-8 pt-8">
        <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden rounded-3xl">
          {artist.profile.bannerUrl ? (
            <Image
              src={artist.profile.bannerUrl}
              alt={`${artist.name} banner`}
              fill
              className="object-cover opacity-90"
              priority
            />
          ) : (
            <div className="h-full w-full bg-black/30" />
          )}
        </div>
  
        <div className="flex items-center gap-4 mt-4">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full ring-2 ring-white/20 overflow-hidden bg-black/30">
            <Image
              src={artist.profile.avatarUrl || "/default-avatar.png"}
              alt={`${artist.name} avatar`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl">{artist.name}</h1>
            <div className="mt-1 flex items-center gap-4 text-xs text-white/70">
              <span className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faEye} />
                {artist.stats.totalViews.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faHeart} />
                {artist.stats.totalLikes.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<FontAwesomeIcon icon={faCrown} className="text-3xl" />}
            label="RANKING"
            value={`#${artist.stats.ranking}`}
          />
          <StatCard
            icon={
              <FontAwesomeIcon icon={faCalendarDays} className="text-3xl" />
            }
            label="MEMBER SINCE"
            value={formatDate(artist.stats.memberSince)}
          />
          <StatCard
            icon={
              <FontAwesomeIcon icon={faCloudArrowUp} className="text-3xl" />
            }
            label="TOTAL MUSICS"
            value={artist.stats.totalSongs.toString()}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-sm text-white/80">Uploaded content</h2>
          <p className="text-xs text-white/50">
            Musics that {artist.name} created on Drillrecord.
          </p>

          <div className="mt-3 rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-[1fr_160px_32px] md:grid-cols-[1fr_220px_48px] items-center bg-white/5 px-4 py-2 text-xs text-white/70">
              <div>Name</div>
              <div className="justify-self-end">Uploaded at&nbsp;↑↓</div>
              <div />
            </div>

            <ul className="divide-y divide-white/10">
              {songs.map((s) => (
                <li
                  key={s.id}
                  className="grid grid-cols-[1fr_160px_32px] md:grid-cols-[1fr_220px_48px] items-center px-4 py-3"
                >
                  <Link
                    href={`/songs/${s.slug}`}
                    className="min-w-0 hover:underline"
                  >
                    <div className="truncate font-medium">{s.title}</div>
                    <div className="text-xs text-white/60 truncate">
                      {artist.name}
                    </div>
                  </Link>

                  <div className="justify-self-end text-sm text-white/80">
                    {formatDate(s.releasedAt)}
                  </div>

                  <button
                    aria-label="Row actions"
                    className="justify-self-end text-white/60 hover:text-white/90"
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-6 py-5 flex items-center gap-5">
      <div className="shrink-0 text-white/90">{icon}</div>
      <div>
        <div className="text-[11px] tracking-wide text-white/60">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

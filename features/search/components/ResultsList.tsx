import Link from "next/link";
import type { DatasetItem } from "../types";

export function ResultsList({ items }: { items: DatasetItem[] }) {
  if (!items.length) return null;

  return (
    <ul className="space-y-2">
      {items.map((row) => (
        <li
          key={`${row.rank}-${row.artistId}-${row.songId}`}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm"
        >
          <Link href={`/artists/${row.artistSlug}`}>
            <p className="font-medium hover:underline">
              {row.rank}. {row.artistName}
            </p>
          </Link>
          <div className="text-muted-fg text-xs sm:text-sm">
            <Link href={`/songs/${row.songSlug}`}>
              <p className="hover:underline">
                {row.songTitle} · {row.views.toLocaleString()} plays ·{" "}
                {row.hearts.toLocaleString()} likes
              </p>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

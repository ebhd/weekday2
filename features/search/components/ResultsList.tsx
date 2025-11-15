import type { DatasetItem } from "../types";

export function ResultsList({ items }: { items: DatasetItem[] }) {
  if (!items.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((row) => (
        <li
          key={`${row.rank}-${row.artistsName}-${row.songName}`}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm"
        >
          <div className="font-medium">
            {row.rank}. {row.artistsName}
          </div>
          <div className="text-muted-fg text-xs sm:text-sm">
            {row.songName} · {row.views.toLocaleString()} plays ·{" "}
            {row.hearts.toLocaleString()} likes
          </div>
        </li>
      ))}
    </ul>
  );
}

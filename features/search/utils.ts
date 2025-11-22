import type { SuggestionOptions } from "./types";

export const normalize = (s: string) => s.toLowerCase().trim();

/** case-insensitive unique */
export function uniqueStrings(arr: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of arr) {
    const n = normalize(x);
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(x);
  }
  return out;
}

export function makeSuggestions(
  source: string[],
  q: string,
  opts: SuggestionOptions = {}
): string[] {
  const { min = 2, mode = "startsWith", limit = 5 } = opts;

  const n = normalize(q);
  if (n.length < min) return [];

  const match =
    mode === "startsWith"
      ? (x: string) => normalize(x).startsWith(n)
      : (x: string) => normalize(x).includes(n);

  return uniqueStrings(source).filter(match).slice(0, limit);
}

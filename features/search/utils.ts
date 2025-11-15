import { SuggestionOptions } from "./types";

export const normalize = (s: string) => s.toLowerCase().trim();

export const unique = <T>(arr: T[]) => Array.from(new Set(arr));

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

  return unique(source).filter(match).slice(0, limit);
}

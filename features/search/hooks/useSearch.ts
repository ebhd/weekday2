//  features/search/hooks/useSearch.ts
"use client";

import { useMemo, useState } from "react";
import type { DatasetItem, SearchQuery, SearchResult } from "../types";
import { makeSuggestions, normalize, uniqueStrings } from "../utils";

export function useSearch(dataset: DatasetItem[]) {
  const [query, setQuery] = useState<SearchQuery>({ artist: "", track: "" });

  const hasMinQuery =
    query.artist.trim().length >= 2 || query.track.trim().length >= 2;

  const { artistNames, songTitles } = useMemo(() => {
    return {
      artistNames: uniqueStrings(dataset.map((r) => r.artistName)),
      songTitles: uniqueStrings(dataset.map((r) => r.songTitle)),
    };
  }, [dataset]);

  const results: SearchResult = useMemo(() => {
    if (!hasMinQuery) return [];
    const a = normalize(query.artist);
    const t = normalize(query.track);

    return dataset.filter((row) => {
      const artistHit = a ? normalize(row.artistName).includes(a) : true;
      const trackHit = t ? normalize(row.songTitle).includes(t) : true;
      return artistHit && trackHit;
    });
  }, [dataset, query, hasMinQuery]);

  const artistSuggestions = useMemo(
    () =>
      makeSuggestions(artistNames, query.artist, {
        mode: "startsWith",
        limit: 5,
      }),
    [artistNames, query.artist]
  );

  const trackSuggestions = useMemo(
    () =>
      makeSuggestions(songTitles, query.track, {
        mode: "includes",
        limit: 5,
      }),
    [songTitles, query.track]
  );

  return {
    query,
    setArtist: (v: string) => setQuery((q) => ({ ...q, artist: v })),
    setTrack: (v: string) => setQuery((q) => ({ ...q, track: v })),
    hasMinQuery,
    results,
    artistSuggestions,
    trackSuggestions,
  };
}

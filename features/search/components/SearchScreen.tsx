// features/search/components/SearchScreen.tsx
"use client";

import { Mic, Music } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { ResultsList } from "./ResultsList";
import { useSearch } from "../hooks/useSearch";
import type { DatasetItem } from "../types";

export default function SearchScreen({ dataset }: { dataset: DatasetItem[] }) {
  const {
    query,
    setArtist,
    setTrack,
    hasMinQuery,
    results,
    artistSuggestions,
    trackSuggestions,
  } = useSearch(dataset);

  return (
    <div className="md:px-48 px-4 lg:mt-40 mt-24 space-y-6">
      <h1 className="font-display text-center text-4xl lg:text-5xl lg:text-left">
        Find Real Talents. Instantly.
      </h1>

      <p className="text-muted-fg font-sans lg:text-left text-center lg:text-lg text-xs">
        Search across verified underground artists and tracks
        <br />
        no fake profiles, just raw music waiting to be discovered
      </p>

      <div className="mt-8 max-w-5xl mx-auto lg:mx-0 flex flex-col lg:flex-row gap-4">
        <SearchInput
          icon={<Mic className="h-5 w-5 text-muted-fg" aria-hidden="true" />}
          placeholder="Type an artist name..."
          value={query.artist}
          onChange={setArtist}
          suggestions={artistSuggestions}
          onSelectSuggestion={setArtist}
        />
        <SearchInput
          icon={<Music className="h-5 w-5 text-muted-fg" aria-hidden="true" />}
          placeholder="Type a track title..."
          value={query.track}
          onChange={setTrack}
          suggestions={trackSuggestions}
          onSelectSuggestion={setTrack}
        />
      </div>

      <section className="mt-10 space-y-3">
        {!hasMinQuery ? (
          <p className="text-sm text-muted-fg">
            Type at least 2 characters to search.
          </p>
        ) : results.length === 0 ? (
          <p className="text-sm text-muted-fg">
            No matching tracks yet. Try another artist or song title.
          </p>
        ) : (
          <ResultsList items={results} />
        )}
      </section>
    </div>
  );
}

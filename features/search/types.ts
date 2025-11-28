// features/search/types.ts

import type { ReactNode } from "react";

export type SearchResultItem = {
  rank: number;

  artistId: string;
  artistSlug: string;
  artistName: string;

  songId: string;
  songSlug: string;
  songTitle: string;

  views: number;
  hearts: number;
};

export type DatasetItem = SearchResultItem;

export type SearchQuery = {
  artist: string;
  track: string;
};

export type SearchResult = DatasetItem[];

export type SuggestionList = string[];

export type SuggestionOptions = {
  min?: number;
  mode?: "startsWith" | "includes";
  limit?: number;
};

export type SearchInputProps = {
  icon?: ReactNode;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  suggestions?: string[];
  onSelectSuggestion?: (v: string) => void;
  className?: string;
};

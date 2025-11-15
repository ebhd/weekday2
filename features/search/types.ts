import type { RankingRowProps } from "@/features/ranking/types";

export type DatasetItem = RankingRowProps;

export type SearchQuery = {
  artist: string;
  track: string;
};

export type SuggestionList = string[];

export type SearchResult = DatasetItem[];

export type SearchInputProps = {
  icon?: React.ReactNode;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  suggestions?: string[];
  onSelectSuggestion?: (v: string) => void;
  className?: string;
};

export type SuggestionOptions = {
  min?: number;
  mode?: "startsWith" | "includes";
  limit?: number;
};

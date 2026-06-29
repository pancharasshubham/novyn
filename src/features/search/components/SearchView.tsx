"use client";

import { useEffect, useMemo } from "react";
import type { SavedItem } from "@/types/saved-item";
import { topTags } from "../stats";
import { useRecentSearches } from "../useRecentSearches";
import { useSearch } from "../useSearch";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import { SearchSuggestions } from "./SearchSuggestions";

const EXAMPLES = ["AI", "startup", "claude", "automation"];

interface SearchViewProps {
  items: SavedItem[];
  onReset: () => void;
}

/**
 * The post-import library: a prominent search bar over everything that was
 * imported. Empty field → suggestions (recent + examples + your top hashtags);
 * typing → live, highlighted results with match stats.
 */
export function SearchView({ items, onReset }: SearchViewProps) {
  const { query, setQuery, results, terms, isPending } = useSearch(items);
  const { recent, record, clear } = useRecentSearches();
  const tags = useMemo(() => topTags(items, 6), [items]);

  // Remember a search once it settles, not on every keystroke.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    const id = setTimeout(() => record(trimmed), 700);
    return () => clearTimeout(id);
  }, [query, record]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-muted">
          <span className="font-medium text-white">
            {items.length.toLocaleString()}
          </span>{" "}
          saved posts
        </p>
        <button
          onClick={onReset}
          className="rounded-lg border border-edge px-3 py-1.5 text-sm text-muted transition-colors hover:border-muted hover:text-white"
        >
          Import another
        </button>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      {hasQuery ? (
        <div
          className={
            isPending ? "opacity-60 transition-opacity" : "transition-opacity"
          }
        >
          <SearchResults results={results} query={query} terms={terms} />
        </div>
      ) : (
        <SearchSuggestions
          recent={recent}
          examples={EXAMPLES}
          tags={tags}
          onPick={setQuery}
          onClearRecent={clear}
        />
      )}
    </div>
  );
}

"use client";

import type { SavedItem } from "@/types/saved-item";
import { useSearch } from "../useSearch";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";

interface SearchViewProps {
  items: SavedItem[];
  onReset: () => void;
}

/**
 * The post-import library: a prominent search bar over everything that was
 * imported, with the live result list beneath it.
 */
export function SearchView({ items, onReset }: SearchViewProps) {
  const { query, setQuery, results, isPending } = useSearch(items);

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

      <div className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}>
        <SearchResults results={results} query={query} />
      </div>
    </div>
  );
}

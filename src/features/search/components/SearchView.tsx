"use client";

import { DiscoveryHome } from "@/features/discovery/components/DiscoveryHome";
import type { SavedItem } from "@/types/saved-item";
import { useSearch } from "../useSearch";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";

interface SearchViewProps {
  items: SavedItem[];
  onReset: () => void;
}

/**
 * The post-import experience. Search sits at the top as a utility; an empty
 * field shows the Discovery Home (the import payoff), and typing switches to
 * live, highlighted results.
 */
export function SearchView({ items, onReset }: SearchViewProps) {
  const { query, setQuery, results, terms, isPending } = useSearch(items);
  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
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
        <DiscoveryHome items={items} onPick={setQuery} />
      )}
    </div>
  );
}

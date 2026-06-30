"use client";

import { ReflectionHome } from "@/features/reflection/components/ReflectionHome";
import { SearchBar } from "@/features/search/components/SearchBar";
import { SearchResults } from "@/features/search/components/SearchResults";
import { useSearch } from "@/features/search/useSearch";
import type { SavedItem } from "@/types/saved-item";

interface HomeShellProps {
  items: SavedItem[];
  onReset: () => void;
}

/**
 * The post-import home. Reflection is the product; search is a prominent,
 * always-visible utility at the top. Typing replaces the reflection canvas with
 * the searchable library. Full-width, desktop-first.
 */
export function HomeShell({ items, onReset }: HomeShellProps) {
  const { query, setQuery, results, terms, isPending } = useSearch(items);
  const hasQuery = query.trim().length > 0;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
      <header className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          NOVYN
        </p>
        <button
          onClick={onReset}
          className="shrink-0 rounded-lg border border-edge px-3 py-1.5 text-sm text-muted transition-colors hover:border-muted hover:text-white"
        >
          Import another
        </button>
      </header>

      {/* Search stays highly visible — but it is a utility, not the page. */}
      <SearchBar value={query} onChange={setQuery} />

      {hasQuery ? (
        <div
          className={
            isPending ? "opacity-60 transition-opacity" : "transition-opacity"
          }
        >
          <div className="mx-auto w-full max-w-3xl">
            <SearchResults results={results} query={query} terms={terms} />
          </div>
        </div>
      ) : (
        <ReflectionHome items={items} onPick={setQuery} />
      )}
    </div>
  );
}

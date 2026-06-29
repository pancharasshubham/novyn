"use client";

import { SavedItemCard } from "@/components/SavedItemCard";
import type { SavedItem } from "@/types/saved-item";

/**
 * Cap on how many cards we actually render. The match *count* always reflects
 * the full result set; this only limits DOM nodes so a 4,000-match query stays
 * smooth without a virtualization library.
 */
const RENDER_LIMIT = 100;

interface SearchResultsProps {
  results: SavedItem[];
  query: string;
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-2xl border border-edge bg-surface px-6 py-12 text-center">
      <p className="text-base font-medium text-white">No results found</p>
      <p className="mt-1 text-sm text-muted">
        Nothing matched “{query.trim()}”.
      </p>
      <ul className="mt-4 space-y-1 text-sm text-muted">
        <li>Try another keyword</li>
        <li>Search a creator name or @username</li>
        <li>Search a hashtag</li>
      </ul>
    </div>
  );
}

export function SearchResults({ results, query }: SearchResultsProps) {
  const hasQuery = query.trim().length > 0;

  if (hasQuery && results.length === 0) {
    return <EmptyState query={query} />;
  }

  const visible = results.slice(0, RENDER_LIMIT);
  const total = results.length;

  return (
    <div className="flex flex-col gap-3">
      <p className="px-1 text-sm text-muted">
        {total.toLocaleString()} {total === 1 ? "result" : "results"} found.
      </p>

      <ul className="divide-y divide-edge overflow-hidden rounded-2xl border border-edge bg-surface">
        {visible.map((item) => (
          <SavedItemCard key={item.id} item={item} />
        ))}
      </ul>

      {total > RENDER_LIMIT && (
        <p className="px-1 text-center text-sm text-muted">
          Showing the first {RENDER_LIMIT.toLocaleString()}. Refine your search to
          narrow it down.
        </p>
      )}
    </div>
  );
}

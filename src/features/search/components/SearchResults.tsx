"use client";

import { useMemo } from "react";
import { SavedItemCard } from "@/components/SavedItemCard";
import type { SavedItem } from "@/types/saved-item";
import { formatMonthYear, searchStats } from "../stats";

/**
 * Cap on how many cards we actually render. The match *count* always reflects
 * the full result set; this only limits DOM nodes so a 4,000-match query stays
 * smooth without a virtualization library.
 */
const RENDER_LIMIT = 100;

interface SearchResultsProps {
  results: SavedItem[];
  query: string;
  terms: string[];
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-2xl border border-edge bg-surface px-6 py-12 text-center">
      <p className="text-base font-medium text-white">No results found</p>
      <p className="mt-1 text-sm text-muted">
        Nothing matched “{query.trim()}”.
      </p>
      <ul className="mt-4 space-y-1 text-sm text-muted">
        <li>Try a creator name</li>
        <li>Try a hashtag</li>
        <li>Try a broader keyword</li>
      </ul>
    </div>
  );
}

export function SearchResults({ results, query, terms }: SearchResultsProps) {
  const hasQuery = query.trim().length > 0;
  const stats = useMemo(() => searchStats(results), [results]);

  if (hasQuery && results.length === 0) {
    return <EmptyState query={query} />;
  }

  const visible = results.slice(0, RENDER_LIMIT);
  const total = results.length;
  const first = formatMonthYear(stats.firstSavedAt);
  const latest = formatMonthYear(stats.lastSavedAt);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 px-1">
        <p className="text-sm text-muted">
          <span className="font-medium text-white">
            {total.toLocaleString()}
          </span>{" "}
          {total === 1 ? "result" : "results"}
          {hasQuery && (
            <>
              {" for "}
              <span className="text-white">“{query.trim()}”</span>
            </>
          )}
        </p>
        {total > 0 && first && latest && (
          <p className="text-xs text-muted">
            {first === latest ? (
              <>Saved {first}</>
            ) : (
              <>
                First saved {first} · Most recent {latest}
              </>
            )}
          </p>
        )}
      </div>

      <ul className="divide-y divide-edge overflow-hidden rounded-2xl border border-edge bg-surface">
        {visible.map((item) => (
          <SavedItemCard key={item.id} item={item} terms={terms} />
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

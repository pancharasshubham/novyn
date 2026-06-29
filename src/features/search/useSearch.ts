"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { SavedItem } from "@/types/saved-item";
import { buildSearchIndex, searchIndex } from "./search";

/**
 * Search state for a set of saved items.
 *
 * - The index is memoized on `items`, so it's built once per import, not per key.
 * - Results are memoized on the (deferred) query, so they recompute only when
 *   the query actually changes.
 * - `useDeferredValue` lets the input stay responsive while the large result
 *   list re-renders against the slightly-behind query.
 */
export function useSearch(items: SavedItem[]) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const index = useMemo(() => buildSearchIndex(items), [items]);
  const results = useMemo(
    () => searchIndex(index, deferredQuery),
    [index, deferredQuery],
  );

  // The active terms, memoized so highlighting stays referentially stable and
  // memoized cards only re-render when the terms actually change.
  const terms = useMemo(
    () => deferredQuery.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [deferredQuery],
  );

  return {
    query,
    setQuery,
    results,
    terms,
    /** True while the displayed results lag a still-changing query. */
    isPending: query !== deferredQuery,
  };
}

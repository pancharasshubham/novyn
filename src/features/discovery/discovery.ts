import { searchStats } from "@/features/search/stats";
import type { SavedItem } from "@/types/saved-item";

/**
 * Library-level aggregations used by the reflection home.
 *
 * All pure functions over the normalized SavedItem, so the day other sources
 * land (YouTube, bookmarks, …) they work unchanged. No AI, no analysis — just
 * simple "what's in here" reflections.
 */

export interface LibraryStats {
  total: number;
  oldestSavedAt?: string;
  newestSavedAt?: string;
  creatorCount: number;
}

/** Numeric save time, with missing/invalid dates sorted to the very end. */
function savedMs(item: SavedItem): number {
  if (!item.savedAt) return Number.NEGATIVE_INFINITY;
  const ms = Date.parse(item.savedAt);
  return Number.isNaN(ms) ? Number.NEGATIVE_INFINITY : ms;
}

/** The most recently saved items first. */
export function recentSaves(items: SavedItem[], limit = 8): SavedItem[] {
  return [...items].sort((a, b) => savedMs(b) - savedMs(a)).slice(0, limit);
}

/** Stable key for grouping a creator: prefer the unique handle. */
function creatorKey(item: SavedItem): string | undefined {
  const key = item.creatorUsername?.trim() || item.creator?.trim();
  return key ? key.toLowerCase() : undefined;
}

/** How many distinct creators are in the library. */
export function creatorCount(items: SavedItem[]): number {
  const keys = new Set<string>();
  for (const item of items) {
    const key = creatorKey(item);
    if (key) keys.add(key);
  }
  return keys.size;
}

/** Headline numbers: total saves, date range, and distinct creators. */
export function libraryStats(items: SavedItem[]): LibraryStats {
  const { firstSavedAt, lastSavedAt } = searchStats(items);
  return {
    total: items.length,
    oldestSavedAt: firstSavedAt,
    newestSavedAt: lastSavedAt,
    creatorCount: creatorCount(items),
  };
}

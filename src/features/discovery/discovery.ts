import { searchStats } from "@/features/search/stats";
import type { SavedItem } from "@/types/saved-item";

/**
 * Aggregations that power the Discovery Home — the post-import payoff screen.
 *
 * All pure functions over the normalized SavedItem, so the day other sources
 * land (YouTube, bookmarks, …) discovery works on them with no changes. No AI,
 * no timelines, no analysis — just simple "what did I import" reflections.
 */

/** A creator grouped across their saves. */
export interface CreatorSummary {
  /** Display name, or undefined when only a handle is known. */
  name?: string;
  username?: string;
  count: number;
}

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
  const username = item.creatorUsername?.trim();
  const name = item.creator?.trim();
  const key = username || name;
  return key ? key.toLowerCase() : undefined;
}

/** Creators ranked by how often they appear in the library. */
export function topCreators(items: SavedItem[], limit = 8): CreatorSummary[] {
  const map = new Map<string, CreatorSummary>();

  for (const item of items) {
    const key = creatorKey(item);
    if (!key) continue;

    const name = item.creator?.trim() || undefined;
    const username = item.creatorUsername?.trim() || undefined;

    const existing = map.get(key);
    if (existing) {
      existing.count++;
      if (!existing.name && name) existing.name = name;
      if (!existing.username && username) existing.username = username;
    } else {
      map.set(key, { name, username, count: 1 });
    }
  }

  return [...map.values()]
    .sort(
      (a, b) =>
        b.count - a.count ||
        (a.name ?? a.username ?? "").localeCompare(b.name ?? b.username ?? ""),
    )
    .slice(0, limit);
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

/** A random saved item, for the "I forgot I saved this" moment. */
export function randomSave(items: SavedItem[]): SavedItem | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

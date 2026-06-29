import type { SavedItem } from "@/types/saved-item";

/**
 * Lightweight aggregates over a result set. Pure functions over SavedItem, so
 * they work unchanged for any future source.
 */

export interface SearchStats {
  count: number;
  /** ISO date of the oldest matching save, if any have a date. */
  firstSavedAt?: string;
  /** ISO date of the newest matching save, if any have a date. */
  lastSavedAt?: string;
}

/** Count matches and find the earliest / latest save date among them. */
export function searchStats(items: SavedItem[]): SearchStats {
  let firstMs: number | undefined;
  let lastMs: number | undefined;
  let firstSavedAt: string | undefined;
  let lastSavedAt: string | undefined;

  for (const item of items) {
    if (!item.savedAt) continue;
    const ms = Date.parse(item.savedAt);
    if (Number.isNaN(ms)) continue;

    if (firstMs === undefined || ms < firstMs) {
      firstMs = ms;
      firstSavedAt = item.savedAt;
    }
    if (lastMs === undefined || ms > lastMs) {
      lastMs = ms;
      lastSavedAt = item.savedAt;
    }
  }

  return { count: items.length, firstSavedAt, lastSavedAt };
}

/** Format an ISO date as e.g. "January 2025". Empty string if missing/invalid. */
export function formatMonthYear(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

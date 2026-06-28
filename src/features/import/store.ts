import type { SavedItem } from "@/types/saved-item";

/**
 * In-memory store for imported items (M1).
 *
 * This is deliberately the smallest thing that works: a module-level array that
 * lives for the lifetime of the browser session. There is no persistence yet —
 * Supabase arrives in a later milestone, at which point this module is the one
 * seam that has to change.
 */
let items: SavedItem[] = [];

export const savedItemStore = {
  /** Replace the entire collection with a freshly imported set. */
  set(next: SavedItem[]): void {
    items = next;
  },

  /** Read the current collection. */
  getAll(): SavedItem[] {
    return items;
  },

  /** Number of items currently held. */
  count(): number {
    return items.length;
  },

  /** Drop everything. */
  clear(): void {
    items = [];
  },
};

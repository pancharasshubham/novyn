import type { SavedItem } from "@/types/saved-item";

/**
 * Keyword search over the normalized SavedItem model.
 *
 * This is deliberately source-agnostic: it reads only `SavedItem` fields, so the
 * day YouTube / bookmarks / LinkedIn parsers land, search works on them with no
 * changes. No external library, database, or embeddings — just substring
 * matching over a precomputed text index.
 */

export interface SearchIndexEntry {
  item: SavedItem;
  /** Lowercased concatenation of every searchable field. */
  haystack: string;
}

/** The fields a query is matched against, joined into one lowercased string. */
function haystackFor(item: SavedItem): string {
  return [
    item.title,
    item.description, // caption
    item.creator, // creator name
    item.creatorUsername, // username
    item.tags.join(" "), // hashtags
    item.url,
  ]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
}

/**
 * Precompute the searchable text for every item, once. Rebuilding this per
 * keystroke would be the bottleneck at 4,500+ items; doing it once per import
 * keeps each query to a cheap set of substring checks.
 */
export function buildSearchIndex(items: SavedItem[]): SearchIndexEntry[] {
  return items.map((item) => ({ item, haystack: haystackFor(item) }));
}

/**
 * Filter a prebuilt index by query. Case-insensitive, partial (substring), and
 * multi-word (every whitespace-separated term must appear). An empty query
 * returns everything, so the full library shows by default.
 */
export function searchIndex(
  index: SearchIndexEntry[],
  query: string,
): SavedItem[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return index.map((entry) => entry.item);

  return index
    .filter((entry) => terms.every((term) => entry.haystack.includes(term)))
    .map((entry) => entry.item);
}

/** One-shot search (builds the index, then filters). Handy for tests. */
export function searchSavedItems(
  items: SavedItem[],
  query: string,
): SavedItem[] {
  return searchIndex(buildSearchIndex(items), query);
}

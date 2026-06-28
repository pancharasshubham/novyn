/**
 * The unified, source-agnostic model for any saved piece of content.
 *
 * Every parser (Instagram today; YouTube / Bookmarks / LinkedIn / GitHub later)
 * normalizes its raw export into this shape. Nothing downstream — search,
 * timeline, insights — should ever need to know which source an item came from
 * beyond the `source` discriminator.
 *
 * Canonical definition: docs/data-model.md
 */

/** Sources NOVYN can ingest. Only "instagram" is implemented in M1. */
export type SavedItemSource = "instagram";

export interface SavedItem {
  /** Stable, deduplicated identifier for this item. */
  id: string;

  /** Which platform this item was saved on. */
  source: SavedItemSource;

  /** Human-facing title, when the source provides one. */
  title?: string;

  /** Caption / description text, when available. */
  description?: string;

  /** The account that authored the saved content. */
  creator?: string;

  /** Canonical link back to the original content. */
  url?: string;

  /** When the user saved it, as an ISO 8601 string. */
  savedAt?: string;

  /** Free-form tags. Empty for M1 — populated by later analysis milestones. */
  tags: string[];

  /** The untouched source record, kept for debugging and future re-parsing. */
  rawData?: unknown;
}

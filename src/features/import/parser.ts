import type { SavedItem } from "@/types/saved-item";
import type { InstagramSavedExport, InstagramSavedMedia } from "./types";

/** Convert Instagram's Unix-seconds timestamp to an ISO 8601 string. */
function toIso(timestamp?: number): string | undefined {
  if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) {
    return undefined;
  }
  return new Date(timestamp * 1000).toISOString();
}

/**
 * Build a stable id for a saved item. The post URL is naturally unique, so we
 * prefer it; otherwise fall back to the record's position in the export.
 */
function buildId(url: string | undefined, index: number): string {
  return url ? `instagram:${url}` : `instagram:index:${index}`;
}

/** Normalize a single Instagram record into a SavedItem, or null if unusable. */
function toSavedItem(media: InstagramSavedMedia, index: number): SavedItem | null {
  const savedOn = media.string_map_data?.["Saved on"];
  const url = savedOn?.href?.trim() || undefined;
  const creator = media.title?.trim() || undefined;

  // A record with neither a link nor a creator carries no signal — skip it.
  if (!url && !creator) {
    return null;
  }

  return {
    id: buildId(url, index),
    source: "instagram",
    creator,
    url,
    savedAt: toIso(savedOn?.timestamp),
    tags: [],
    rawData: media,
  };
}

/**
 * Normalize a validated Instagram export into SavedItems.
 *
 * Deduplicates by id so re-importing the same export (or overlapping exports)
 * never produces duplicate items.
 */
export function parseInstagramExport(data: InstagramSavedExport): SavedItem[] {
  const records = data.saved_saved_media ?? [];
  const byId = new Map<string, SavedItem>();

  records.forEach((record, index) => {
    const item = toSavedItem(record, index);
    if (item && !byId.has(item.id)) {
      byId.set(item.id, item);
    }
  });

  return Array.from(byId.values());
}

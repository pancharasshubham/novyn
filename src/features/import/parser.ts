import type { SavedItem } from "@/types/saved-item";
import type {
  InstagramSavedExport,
  InstagramSavedItem,
  LabelValue,
} from "./types";

/** Convert Instagram's Unix-seconds timestamp to an ISO 8601 string. */
function toIso(timestamp?: number): string | undefined {
  if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) {
    return undefined;
  }
  return new Date(timestamp * 1000).toISOString();
}

/**
 * Find a label's value, trying each alias in order (case-insensitive). Falls
 * back to `href` because some exports carry links there instead of `value`.
 */
function findValue(labels: LabelValue[], aliases: string[]): string | undefined {
  for (const alias of aliases) {
    const match = labels.find((lv) => lv.label?.trim().toLowerCase() === alias);
    const value = match?.value?.trim() || match?.href?.trim();
    if (value) return value;
  }
  return undefined;
}

/** Pull hashtags out of caption text, deduped and lowercased, without the `#`. */
const HASHTAG = /#([\p{L}\p{N}_]+)/gu;
function extractHashtags(caption?: string): string[] {
  if (!caption) return [];
  const tags = new Set<string>();
  for (const match of caption.matchAll(HASHTAG)) {
    tags.add(match[1].toLowerCase());
  }
  return Array.from(tags);
}

/** The post fields we lift out of an export item before normalizing. */
interface ExtractedFields {
  url?: string;
  caption?: string;
  owner?: string;
  username?: string;
  hashtags: string[];
  savedAt?: string;
}

/** Extract the post's fields from its label_values + top-level timestamp. */
function extractFields(item: InstagramSavedItem): ExtractedFields {
  const labels = item.label_values ?? [];
  const caption = findValue(labels, ["caption"]);

  return {
    url: findValue(labels, ["url"]),
    caption,
    owner: findValue(labels, ["owner", "owner username", "media owner"]),
    username: findValue(labels, ["username", "user name", "account"]),
    hashtags: extractHashtags(caption),
    savedAt: toIso(item.timestamp),
  };
}

/**
 * Build a stable id. The post URL is naturally unique, so prefer it; otherwise
 * fall back to Instagram's fbid, then to the record's position in the export.
 */
function buildId(
  item: InstagramSavedItem,
  url: string | undefined,
  index: number,
): string {
  if (url) return `instagram:${url}`;
  if (item.fbid) return `instagram:fbid:${item.fbid}`;
  return `instagram:index:${index}`;
}

/** Normalize a single export item into a SavedItem, or null if unusable. */
function toSavedItem(item: InstagramSavedItem, index: number): SavedItem | null {
  const fields = extractFields(item);
  // Prefer the handle (username) as the creator; fall back to the owner name.
  const creator = fields.username || fields.owner;

  // A record with no link, creator, or caption carries no signal — skip it.
  if (!fields.url && !creator && !fields.caption) {
    return null;
  }

  return {
    id: buildId(item, fields.url, index),
    source: "instagram",
    description: fields.caption,
    creator,
    url: fields.url,
    savedAt: fields.savedAt,
    tags: fields.hashtags,
    rawData: item,
  };
}

/**
 * Normalize a validated Instagram export (a top-level array) into SavedItems.
 *
 * Deduplicates by id so re-importing the same export (or overlapping exports)
 * never produces duplicate items.
 */
export function parseInstagramExport(data: InstagramSavedExport): SavedItem[] {
  const items = Array.isArray(data) ? data : [];
  const byId = new Map<string, SavedItem>();

  items.forEach((item, index) => {
    const saved = toSavedItem(item, index);
    if (saved && !byId.has(saved.id)) {
      byId.set(saved.id, saved);
    }
  });

  return Array.from(byId.values());
}

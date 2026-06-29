import type { SavedItem, SavedItemMediaType } from "@/types/saved-item";
import { repairMojibake } from "./text";
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
 * Find a flat label's value among `entries`, trying each alias in order
 * (case-insensitive). Falls back to `href` for link-style entries.
 */
function findValue(entries: LabelValue[], aliases: string[]): string | undefined {
  for (const alias of aliases) {
    const match = entries.find((e) => e.label?.trim().toLowerCase() === alias);
    const value = match?.value?.trim() || match?.href?.trim();
    if (value) return value;
  }
  return undefined;
}

/** Find a nested group entry by its `title` (case-insensitive). */
function findGroup(entries: LabelValue[], title: string): LabelValue | undefined {
  const wanted = title.toLowerCase();
  return entries.find((e) => e.title?.trim().toLowerCase() === wanted);
}

/**
 * Owner is a nested group:
 *   { title: "Owner", dict: [ { dict: [ {label:"Name"...}, {label:"Username"...} ] } ] }
 */
function extractOwner(entries: LabelValue[]): {
  name?: string;
  username?: string;
} {
  const inner = findGroup(entries, "Owner")?.dict?.[0]?.dict ?? [];
  const name = findValue(inner, ["name"]);
  return {
    // Display names can contain emoji/accents and so suffer the export's mojibake.
    name: name ? repairMojibake(name) : undefined,
    // Handles are ASCII, so they're left as-is.
    username: findValue(inner, ["username", "user name"]),
  };
}

/**
 * Hashtags are a nested group, one tag per sub-record:
 *   { title: "Hashtags", dict: [ { dict: [ {label:"Name", value:"saas"} ] }, ... ] }
 * Deduped and lowercased, without the leading "#".
 */
function extractHashtags(entries: LabelValue[]): string[] {
  const groups = findGroup(entries, "Hashtags")?.dict ?? [];
  const tags = new Set<string>();
  for (const group of groups) {
    const name = findValue(group.dict ?? [], ["name"]);
    if (name) tags.add(repairMojibake(name).toLowerCase().replace(/^#/, ""));
  }
  return Array.from(tags);
}

/** Decide reel vs post from the URL path. */
function mediaTypeFromUrl(url?: string): SavedItemMediaType | undefined {
  if (!url) return undefined;
  if (/\/reels?\//i.test(url)) return "reel";
  if (/\/(p|tv)\//i.test(url)) return "post";
  return undefined;
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
  const entries = item.label_values ?? [];

  const url = findValue(entries, ["url"]);
  const rawCaption = findValue(entries, ["caption"]);
  const caption = rawCaption ? repairMojibake(rawCaption) : undefined;
  const owner = extractOwner(entries);
  // Prefer the display name; fall back to the handle so the card is never blank.
  const creator = owner.name || owner.username;

  // A record with no link, creator, or caption carries no signal — skip it.
  if (!url && !creator && !caption) {
    return null;
  }

  return {
    id: buildId(item, url, index),
    source: "instagram",
    mediaType: mediaTypeFromUrl(url),
    description: caption,
    creator,
    creatorUsername: owner.username,
    url,
    savedAt: toIso(item.timestamp),
    tags: extractHashtags(entries),
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

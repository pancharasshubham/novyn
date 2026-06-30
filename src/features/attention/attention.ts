import type { SavedItem } from "@/types/saved-item";
import { STOP_WORDS } from "./stopwords";

/**
 * Attention analysis — pure, explainable observations over imported SavedItems.
 *
 * The principle (see CLAUDE.md): observe repetition, consistency, and recurring
 * attention. Every number a card shows is computed here from the raw saves, so
 * every observation has visible evidence. No AI, no embeddings, no APIs.
 */

/** An interest only counts once it recurs — single saves never become insights. */
const MIN_SAVES = 8;
/** Appearing across this many distinct months reads as "consistent over time". */
const CONSISTENT_MONTHS = 3;

/** Short terms that look better fully capitalized than title-cased. */
const ACRONYMS: ReadonlySet<string> = new Set([
  "ai", "ml", "ux", "ui", "seo", "api", "saas", "b2b", "b2c", "crm", "kpi",
  "llm", "css", "html", "sql",
]);

export interface InterestPattern {
  /** Lowercase canonical token, used for searching. */
  term: string;
  /** Display label, e.g. "AI" or "Fitness". */
  label: string;
  /** Number of saves this term appears in (presence, not frequency). */
  saveCount: number;
  /** Distinct calendar months the term was saved in. */
  monthCount: number;
  /** Distinct creators behind the saves containing this term. */
  creatorCount: number;
  firstSavedAt?: string;
  lastSavedAt?: string;
  /** True when the interest recurs across several months. */
  consistent: boolean;
}

export interface CreatorInfluence {
  name?: string;
  username?: string;
  count: number;
  monthCount: number;
  firstSavedAt?: string;
  lastSavedAt?: string;
}

function displayLabel(term: string): string {
  if (ACRONYMS.has(term)) return term.toUpperCase();
  return term.charAt(0).toUpperCase() + term.slice(1);
}

/** Stable grouping key for a creator: prefer the unique handle. */
function creatorKey(item: SavedItem): string | undefined {
  const key = item.creatorUsername?.trim() || item.creator?.trim();
  return key ? key.toLowerCase() : undefined;
}

/** "2026-05" if the date is valid, else undefined. */
function monthKey(iso?: string): string | undefined {
  if (!iso) return undefined;
  return Number.isNaN(Date.parse(iso)) ? undefined : iso.slice(0, 7);
}

/** Distinct, meaningful tokens in one save (caption + hashtags), deduped. */
function tokensFor(item: SavedItem): Set<string> {
  const tokens = new Set<string>();

  const add = (raw: string) => {
    const token = raw.trim();
    if (token.length < 2) return; // drop single characters
    if (/^\d+$/.test(token)) return; // drop pure numbers
    if (STOP_WORDS.has(token)) return;
    tokens.add(token);
  };

  for (const word of (item.description ?? "").toLowerCase().split(/[^a-z0-9]+/)) {
    add(word);
  }
  for (const tag of item.tags) {
    add(tag.toLowerCase());
  }

  return tokens;
}

interface InterestAcc {
  count: number;
  months: Set<string>;
  creators: Set<string>;
  firstMs?: number;
  lastMs?: number;
  firstSavedAt?: string;
  lastSavedAt?: string;
}

/**
 * The interests a user returns to most, with the evidence behind each: how many
 * saves, across how many months, from how many creators, and the date span.
 */
export function analyzeInterests(
  items: SavedItem[],
  limit = 8,
): InterestPattern[] {
  const map = new Map<string, InterestAcc>();

  for (const item of items) {
    const tokens = tokensFor(item);
    if (tokens.size === 0) continue;

    const month = monthKey(item.savedAt);
    const ms = item.savedAt ? Date.parse(item.savedAt) : NaN;
    const validMs = !Number.isNaN(ms);
    const key = creatorKey(item);

    for (const term of tokens) {
      let acc = map.get(term);
      if (!acc) {
        acc = { count: 0, months: new Set(), creators: new Set() };
        map.set(term, acc);
      }
      acc.count++;
      if (month) acc.months.add(month);
      if (key) acc.creators.add(key);
      if (validMs) {
        if (acc.firstMs === undefined || ms < acc.firstMs) {
          acc.firstMs = ms;
          acc.firstSavedAt = item.savedAt;
        }
        if (acc.lastMs === undefined || ms > acc.lastMs) {
          acc.lastMs = ms;
          acc.lastSavedAt = item.savedAt;
        }
      }
    }
  }

  const patterns: InterestPattern[] = [];
  for (const [term, acc] of map) {
    if (acc.count < MIN_SAVES) continue;
    patterns.push({
      term,
      label: displayLabel(term),
      saveCount: acc.count,
      monthCount: acc.months.size,
      creatorCount: acc.creators.size,
      firstSavedAt: acc.firstSavedAt,
      lastSavedAt: acc.lastSavedAt,
      consistent: acc.months.size >= CONSISTENT_MONTHS,
    });
  }

  patterns.sort(
    (a, b) => b.saveCount - a.saveCount || a.term.localeCompare(b.term),
  );
  return patterns.slice(0, limit);
}

/**
 * The saves whose caption or hashtags contain `term`, newest first. Uses the
 * same token test as the interest counts, so a shelf's items line up with the
 * evidence shown beside it.
 */
export function savesForTerm(
  items: SavedItem[],
  term: string,
  limit = 12,
): SavedItem[] {
  const needle = term.toLowerCase();
  const matches = items.filter((item) => tokensFor(item).has(needle));
  matches.sort((a, b) => {
    const am = a.savedAt ? Date.parse(a.savedAt) : NaN;
    const bm = b.savedAt ? Date.parse(b.savedAt) : NaN;
    return (Number.isNaN(bm) ? -Infinity : bm) - (Number.isNaN(am) ? -Infinity : am);
  });
  return matches.slice(0, limit);
}

interface CreatorAcc {
  name?: string;
  username?: string;
  count: number;
  months: Set<string>;
  firstMs?: number;
  lastMs?: number;
  firstSavedAt?: string;
  lastSavedAt?: string;
}

/** Creators ranked by influence: how often they recur and over how long. */
export function analyzeCreators(
  items: SavedItem[],
  limit = 5,
): CreatorInfluence[] {
  const map = new Map<string, CreatorAcc>();

  for (const item of items) {
    const key = creatorKey(item);
    if (!key) continue;

    const name = item.creator?.trim() || undefined;
    const username = item.creatorUsername?.trim() || undefined;

    let acc = map.get(key);
    if (!acc) {
      acc = { count: 0, months: new Set(), name, username };
      map.set(key, acc);
    } else {
      if (!acc.name && name) acc.name = name;
      if (!acc.username && username) acc.username = username;
    }

    acc.count++;
    const month = monthKey(item.savedAt);
    const ms = item.savedAt ? Date.parse(item.savedAt) : NaN;
    if (month) acc.months.add(month);
    if (!Number.isNaN(ms)) {
      if (acc.firstMs === undefined || ms < acc.firstMs) {
        acc.firstMs = ms;
        acc.firstSavedAt = item.savedAt;
      }
      if (acc.lastMs === undefined || ms > acc.lastMs) {
        acc.lastMs = ms;
        acc.lastSavedAt = item.savedAt;
      }
    }
  }

  return [...map.values()]
    .map((acc) => ({
      name: acc.name,
      username: acc.username,
      count: acc.count,
      monthCount: acc.months.size,
      firstSavedAt: acc.firstSavedAt,
      lastSavedAt: acc.lastSavedAt,
    }))
    .sort(
      (a, b) =>
        b.count - a.count ||
        (a.name ?? a.username ?? "").localeCompare(b.name ?? b.username ?? ""),
    )
    .slice(0, limit);
}

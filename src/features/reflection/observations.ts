import {
  savesForTerm,
  type InterestPattern,
} from "@/features/attention/attention";
import { formatMonthYear } from "@/features/search/stats";
import type { SavedItem } from "@/types/saved-item";

/**
 * Turns the attention engine's patterns into prose observations.
 *
 * The home's primary object is a *sentence about attention*, not a content card.
 * Each observation states what recurred, carries its evidence in the words, and
 * keeps a few real saves so the user can expand and verify. Observation →
 * Evidence: nothing here judges, predicts, or diagnoses.
 */

export interface AttentionObservation {
  id: string;
  term: string;
  text: string;
  /** A few real saves behind the observation, revealed on demand. */
  evidence: SavedItem[];
}

/** Human label for a date range, e.g. "3 years" or "8 months". */
function spanLabel(firstISO?: string, lastISO?: string): string | undefined {
  if (!firstISO || !lastISO) return undefined;
  const a = Date.parse(firstISO);
  const b = Date.parse(lastISO);
  if (Number.isNaN(a) || Number.isNaN(b)) return undefined;
  const months = Math.max(1, Math.round((b - a) / (1000 * 60 * 60 * 24 * 30.44)));
  if (months >= 24) return `${Math.round(months / 12)} years`;
  if (months >= 12) return "1 year";
  return `${months} months`;
}

function observationText(p: InterestPattern): string {
  const first = formatMonthYear(p.firstSavedAt);
  const last = formatMonthYear(p.lastSavedAt);
  const count = p.saveCount.toLocaleString();

  if (p.consistent && first && last) {
    return `${p.label} has appeared consistently — ${count} saves from ${first} to ${last}, across ${p.monthCount} months.`;
  }
  if (p.monthCount > 1) {
    return `${p.label} keeps returning — ${count} saves across ${p.monthCount} months.`;
  }
  return `${p.label} appears in ${count} of your saves.`;
}

/** Build observations from already-computed interest patterns. */
export function buildObservations(
  items: SavedItem[],
  interests: InterestPattern[],
): AttentionObservation[] {
  return interests.map((p) => ({
    id: p.term,
    term: p.term,
    text: observationText(p),
    evidence: savesForTerm(items, p.term, 5),
  }));
}

/** The one synthesized sentence at the top of the home. */
export function coreReflectionText(
  interests: InterestPattern[],
  total: number,
  firstISO?: string,
  lastISO?: string,
): string {
  if (interests.length === 0) {
    return `Your library holds ${total.toLocaleString()} saves.`;
  }
  const labels = interests.slice(0, 2).map((i) => i.label);
  const subject = labels.length === 2 ? `${labels[0]} and ${labels[1]}` : labels[0];
  const span = spanLabel(firstISO, lastISO);
  const tail = span
    ? ` for ${span} — ${total.toLocaleString()} saves in all`
    : ` across ${total.toLocaleString()} saves`;
  return `${subject} have stayed at the center of your attention${tail}.`;
}

/** Rough "N months ago" / "N years ago" for the rediscovery framing. */
export function relativeAge(iso?: string): string | undefined {
  if (!iso) return undefined;
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return undefined;
  const months = Math.round((Date.now() - then) / (1000 * 60 * 60 * 24 * 30.44));
  if (months < 1) return "recently";
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

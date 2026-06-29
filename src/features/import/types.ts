/**
 * Raw shapes for Instagram's data export.
 *
 * The real `saved_posts.json` is a **top-level array**. Each element is one
 * saved post with a save `timestamp`, an `fbid`, and a `label_values` list.
 *
 * `label_values` mixes two kinds of entry:
 *
 *   // flat entry — a single field
 *   { "label": "URL",     "value": "https://www.instagram.com/reel/abc/", "href": "..." }
 *   { "label": "Caption", "value": "great thread #saas #startups" }
 *
 *   // nested group entry — `title` names the group, `dict` holds sub-records
 *   { "title": "Owner",    "dict": [ { "dict": [
 *       { "label": "Name",     "value": "Rupesh Taneja" },
 *       { "label": "Username", "value": "restartwithrt" } ] } ] }
 *   { "title": "Hashtags", "dict": [ { "dict": [ { "label": "Name", "value": "saas" } ] } ] }
 *
 * A single recursive `LabelValue` covers every level. These types describe the
 * export only — they never leak past the parser; everything downstream consumes
 * the normalized SavedItem.
 */

/** One entry in a `label_values` / `dict` list. Flat or a nested group. */
export interface LabelValue {
  /** Present on flat entries (e.g. "URL", "Caption", "Name", "Username"). */
  label?: string;
  /** The flat entry's value. */
  value?: string;
  /** Some flat entries carry the link here instead of (or as well as) `value`. */
  href?: string;
  /** Present on group entries — names the group (e.g. "Owner", "Hashtags"). */
  title?: string;
  /** A group's nested records. */
  dict?: LabelValue[];
}

/** One saved post: a single element of the top-level export array. */
export interface InstagramSavedItem {
  /** When the post was saved, as a Unix timestamp in seconds. */
  timestamp?: number;
  /** Instagram's internal id for the saved media. */
  fbid?: string;
  /** The post's fields — flat values plus nested Owner / Hashtags groups. */
  label_values?: LabelValue[];
}

/** The export itself: a top-level array of saved posts. */
export type InstagramSavedExport = InstagramSavedItem[];

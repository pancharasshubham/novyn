/**
 * Raw shapes for Instagram's data export.
 *
 * The real `saved_posts.json` is a **top-level array**. Each element describes
 * one saved post and carries the save time plus a flat list of label/value
 * pairs holding the post's details:
 *
 *   [
 *     {
 *       "timestamp": 1693526400,
 *       "fbid": "17912345678901234",
 *       "label_values": [
 *         { "label": "Url",      "value": "https://www.instagram.com/p/abc/" },
 *         { "label": "Caption",  "value": "great thread on pricing #saas #startups" },
 *         { "label": "Username", "value": "startup.notes" },
 *         { "label": "Owner",    "value": "Startup Notes" }
 *       ]
 *     }
 *   ]
 *
 * Label names vary across export vintages, so the parser matches them
 * case-insensitively against a small set of aliases. These types describe the
 * export only — they never leak past the parser; everything downstream consumes
 * the normalized SavedItem.
 */

/** One entry in an item's `label_values` array. */
export interface LabelValue {
  label?: string;
  value?: string;
  /** Some exports put links in `href` instead of `value`. */
  href?: string;
}

/** One saved post: a single element of the top-level export array. */
export interface InstagramSavedItem {
  /** When the post was saved, as a Unix timestamp in seconds. */
  timestamp?: number;
  /** Instagram's internal id for the saved media. */
  fbid?: string;
  /** Flat list of the post's fields (url, caption, owner, username, ...). */
  label_values?: LabelValue[];
}

/** The export itself: a top-level array of saved posts. */
export type InstagramSavedExport = InstagramSavedItem[];

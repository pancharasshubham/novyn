/**
 * Raw shapes for Instagram's data export.
 *
 * Instagram exports saved content in `saved_posts.json` under the top-level
 * key `saved_saved_media`. Each record looks roughly like:
 *
 * {
 *   "saved_saved_media": [
 *     {
 *       "title": "creator_username",
 *       "string_map_data": {
 *         "Saved on": {
 *           "href": "https://www.instagram.com/p/abc123/",
 *           "timestamp": 1693526400
 *         }
 *       }
 *     }
 *   ]
 * }
 *
 * These types describe that export only. They never leak past the parser —
 * everything downstream consumes the normalized `SavedItem`.
 */

export interface InstagramStringMapValue {
  href?: string;
  value?: string;
  /** Unix timestamp in seconds. */
  timestamp?: number;
}

export interface InstagramSavedMedia {
  /** Instagram stores the creator's username here. */
  title?: string;
  string_map_data?: {
    "Saved on"?: InstagramStringMapValue;
  };
}

export interface InstagramSavedExport {
  saved_saved_media?: InstagramSavedMedia[];
}

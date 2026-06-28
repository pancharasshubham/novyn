/**
 * Raw shapes for Instagram's data export.
 *
 * Instagram exports saved content in `saved_posts.json` under the top-level
 * key `saved_saved_media`. Each record carries the post link and save time, but
 * in one of two shapes depending on the export vintage:
 *
 *   // older / "map" shape
 *   { "title": "creator", "string_map_data": {
 *       "Saved on": { "href": "https://www.instagram.com/p/abc/", "timestamp": 1693526400 } } }
 *
 *   // newer / "list" shape
 *   { "title": "creator", "string_list_data": [
 *       { "href": "https://www.instagram.com/p/abc/", "value": "", "timestamp": 1693526400 } ] }
 *
 * The parser handles both. These types describe the export only — they never
 * leak past the parser; everything downstream consumes the normalized SavedItem.
 */

/** A single href/value/timestamp triple, used by both export shapes. */
export interface InstagramLinkData {
  href?: string;
  value?: string;
  /** Unix timestamp in seconds. */
  timestamp?: number;
}

export interface InstagramSavedMedia {
  /** Instagram stores the creator's username here. */
  title?: string;
  /** "Map" shape: the save link lives under the "Saved on" key. */
  string_map_data?: {
    "Saved on"?: InstagramLinkData;
  };
  /** "List" shape: the save link is the first (and only) array entry. */
  string_list_data?: InstagramLinkData[];
}

export interface InstagramSavedExport {
  saved_saved_media?: InstagramSavedMedia[];
}

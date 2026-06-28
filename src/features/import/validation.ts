import type { InstagramSavedExport } from "./types";

/**
 * Upper bound on the file we'll read into memory, in bytes (100 MB).
 *
 * The original 10 MB limit was a conservative guess to keep the browser tab
 * from choking while reading and JSON-parsing the whole export in one go. But a
 * heavy Instagram user's real `saved_posts.json` can easily exceed that, so the
 * limit was rejecting legitimate exports. We keep parsing entirely client-side
 * (no chunking, workers, or backend), so the only thing this ceiling guards
 * against now is an obviously-wrong file (a video, a disk image) that would
 * lock up the tab. 100 MB is comfortably above any realistic saved-posts export
 * while still catching that mistake. File *type* is the real gate below.
 */
const MAX_FILE_BYTES = 100 * 1024 * 1024;

export type ValidationResult =
  | { ok: true; data: InstagramSavedExport }
  | { ok: false; error: string };

/**
 * Cheap, synchronous checks on the file handle itself — run before we bother
 * reading the contents. Returns an error message, or null if the file is fine.
 */
export function validateFileMeta(file: File): string | null {
  const isJson =
    file.type === "application/json" ||
    file.name.toLowerCase().endsWith(".json");

  if (!isJson) {
    return "That doesn't look like a JSON file. Upload your Instagram saved_posts.json.";
  }

  if (file.size === 0) {
    return "That file is empty.";
  }

  if (file.size > MAX_FILE_BYTES) {
    const sizeMb = Math.round(file.size / (1024 * 1024));
    return `That file is ${sizeMb} MB, which is beyond the 100 MB we read in the browser. A real saved_posts.json should be well under this — double-check you selected the right file.`;
  }

  return null;
}

/**
 * Parse raw file text and confirm it has the Instagram saved-posts shape.
 * Keeps the failure modes specific so the UI can tell the user what went wrong.
 */
export function parseAndValidate(text: string): ValidationResult {
  let json: unknown;

  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: "This file isn't valid JSON." };
  }

  if (typeof json !== "object" || json === null) {
    return { ok: false, error: "Unexpected JSON structure." };
  }

  const media = (json as InstagramSavedExport).saved_saved_media;

  if (!Array.isArray(media)) {
    return {
      ok: false,
      error:
        "This doesn't look like an Instagram saved-posts export (missing \"saved_saved_media\").",
    };
  }

  if (media.length === 0) {
    return { ok: false, error: "No saved posts were found in this export." };
  }

  return { ok: true, data: json as InstagramSavedExport };
}

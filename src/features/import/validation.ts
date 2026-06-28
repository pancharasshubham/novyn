import type { InstagramSavedExport } from "./types";

/** Largest file we'll attempt to read into memory, in bytes (10 MB). */
const MAX_FILE_BYTES = 10 * 1024 * 1024;

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
    return "That file is larger than 10 MB. Double-check you selected the right export.";
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

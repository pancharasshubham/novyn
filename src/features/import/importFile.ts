import type { SavedItem } from "@/types/saved-item";
import { parseInstagramExport } from "./parser";
import { savedItemStore } from "./store";
import { parseAndValidate, validateFileMeta } from "./validation";

export type ImportResult =
  | { ok: true; items: SavedItem[] }
  | { ok: false; error: string };

/**
 * The full import pipeline for a single dropped/selected file:
 * validate the handle -> read text -> validate JSON shape -> normalize ->
 * commit to the in-memory store. The UI just calls this and renders the result.
 */
export async function importFile(file: File): Promise<ImportResult> {
  const metaError = validateFileMeta(file);
  if (metaError) {
    return { ok: false, error: metaError };
  }

  let text: string;
  try {
    text = await file.text();
  } catch {
    return { ok: false, error: "Couldn't read that file. Try again." };
  }

  const validated = parseAndValidate(text);
  if (!validated.ok) {
    return validated;
  }

  const items = parseInstagramExport(validated.data);
  if (items.length === 0) {
    return { ok: false, error: "No usable saved posts were found in this export." };
  }

  savedItemStore.set(items);
  return { ok: true, items };
}

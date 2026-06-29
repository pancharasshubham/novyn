/**
 * Highlighting for matched search terms.
 *
 * We never inject HTML — instead we split a string into ordered segments and let
 * the renderer wrap the matched ones in <mark>. This is XSS-safe by construction
 * (captions are arbitrary user text) and reuses the same lowercased substring
 * matching the search itself uses, so what's highlighted is exactly what matched.
 */

export interface HighlightSegment {
  text: string;
  match: boolean;
}

/**
 * Split `text` into matched / unmatched segments for every occurrence of any
 * term. Overlapping matches (e.g. "art" and "start") are merged so segments
 * never double-wrap.
 */
export function highlightSegments(
  text: string,
  terms: string[],
): HighlightSegment[] {
  if (!text || terms.length === 0) return [{ text, match: false }];

  const lower = text.toLowerCase();
  const ranges: Array<[number, number]> = [];

  for (const term of terms) {
    if (!term) continue;
    let from = 0;
    for (;;) {
      const idx = lower.indexOf(term, from);
      if (idx === -1) break;
      ranges.push([idx, idx + term.length]);
      from = idx + term.length;
    }
  }

  if (ranges.length === 0) return [{ text, match: false }];

  ranges.sort((a, b) => a[0] - b[0]);

  const merged: Array<[number, number]> = [];
  for (const [start, end] of ranges) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  const segments: HighlightSegment[] = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), match: false });
    }
    segments.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), match: false });
  }

  return segments;
}

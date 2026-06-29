"use client";

import { useMemo } from "react";
import { highlightSegments } from "../highlight";

interface HighlightedTextProps {
  text: string;
  terms: string[];
}

/**
 * Renders `text` with the matched search terms wrapped in <mark>. Segments are
 * memoized so re-renders that don't change the text or terms are free.
 */
export function HighlightedText({ text, terms }: HighlightedTextProps) {
  const segments = useMemo(() => highlightSegments(text, terms), [text, terms]);

  return (
    <>
      {segments.map((segment, i) =>
        segment.match ? (
          <mark
            key={i}
            className="rounded bg-accent/30 px-0.5 text-white"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </>
  );
}

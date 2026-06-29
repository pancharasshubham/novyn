"use client";

import { memo } from "react";
import type { SavedItem } from "@/types/saved-item";

function formatSavedAt(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * One saved post, framed around remembering why it was saved:
 * creator name, @username, caption preview, and date — with the URL secondary.
 *
 * Memoized: in a 4,500-item search, narrowing the query shouldn't re-render
 * cards whose props haven't changed.
 */
export const SavedItemCard = memo(function SavedItemCard({
  item,
}: {
  item: SavedItem;
}) {
  const date = formatSavedAt(item.savedAt);

  return (
    <li className="flex flex-col gap-2 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-white">
              {item.creator ?? "Unknown creator"}
            </p>
            {item.mediaType && (
              <span className="shrink-0 rounded-full border border-edge px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                {item.mediaType}
              </span>
            )}
          </div>
          {item.creatorUsername && (
            <p className="truncate text-xs text-muted">@{item.creatorUsername}</p>
          )}
        </div>
        {date && <span className="shrink-0 text-xs text-muted">{date}</span>}
      </div>

      {item.description && (
        <p className="line-clamp-2 whitespace-pre-line text-sm text-white/80">
          {item.description}
        </p>
      )}

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="truncate text-xs text-muted/70 transition-colors hover:text-accent"
        >
          {item.url}
        </a>
      )}
    </li>
  );
});

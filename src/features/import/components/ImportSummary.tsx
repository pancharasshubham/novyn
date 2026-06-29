"use client";

import type { SavedItem } from "@/types/saved-item";

interface ImportSummaryProps {
  items: SavedItem[];
  onReset: () => void;
}

function formatSavedAt(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const PREVIEW_LIMIT = 8;

/** One saved post, framed around remembering why it was saved. */
function SavedItemCard({ item }: { item: SavedItem }) {
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
            <p className="truncate text-xs text-muted">
              @{item.creatorUsername}
            </p>
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
}

/**
 * Confirmation view shown after a successful import: a headline count and a
 * preview of the saved posts, so the founder can see — and recognize — what
 * came in.
 */
export function ImportSummary({ items, onReset }: ImportSummaryProps) {
  const preview = items.slice(0, PREVIEW_LIMIT);
  const remaining = items.length - preview.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-3xl font-semibold text-white">
            {items.length.toLocaleString()}{" "}
            <span className="text-muted">saved posts imported</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            Held in memory for this session.
          </p>
        </div>
        <button
          onClick={onReset}
          className="rounded-lg border border-edge px-3 py-1.5 text-sm text-muted transition-colors hover:border-muted hover:text-white"
        >
          Import another
        </button>
      </div>

      <ul className="divide-y divide-edge overflow-hidden rounded-2xl border border-edge bg-surface">
        {preview.map((item) => (
          <SavedItemCard key={item.id} item={item} />
        ))}
      </ul>

      {remaining > 0 && (
        <p className="text-center text-sm text-muted">
          + {remaining.toLocaleString()} more
        </p>
      )}
    </div>
  );
}

"use client";

import type { SavedItem } from "@/types/saved-item";

interface ImportSummaryProps {
  items: SavedItem[];
  onReset: () => void;
}

function formatSavedAt(iso?: string): string {
  if (!iso) return "Unknown date";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const PREVIEW_LIMIT = 8;

/**
 * Confirmation view shown after a successful import: a headline count and a
 * short preview of what came in, so the founder can see it actually worked.
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
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {item.creator ?? "Unknown creator"}
              </p>
              {item.url && (
                <p className="truncate text-xs text-muted">{item.url}</p>
              )}
            </div>
            <span className="shrink-0 text-xs text-muted">
              {formatSavedAt(item.savedAt)}
            </span>
          </li>
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

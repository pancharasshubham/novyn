"use client";

import type { SavedItem } from "@/types/saved-item";

function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

interface RecentSavesProps {
  items: SavedItem[];
}

/** A compact list of the latest saves — reassurance, kept small in the rail. */
export function RecentSaves({ items }: RecentSavesProps) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-col">
      {items.map((item) => {
        const date = formatDate(item.savedAt);
        const row = (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-sm font-medium text-white">
                {item.creator ?? "Unknown creator"}
              </p>
              {date && <span className="shrink-0 text-xs text-muted">{date}</span>}
            </div>
            {item.description && (
              <p className="line-clamp-1 text-xs text-muted">
                {item.description}
              </p>
            )}
          </>
        );
        return (
          <li key={item.id} className="border-b border-edge py-3">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block transition-colors hover:opacity-80"
              >
                {row}
              </a>
            ) : (
              row
            )}
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import { useState } from "react";
import type { SavedItem } from "@/types/saved-item";
import { relativeAge } from "../observations";

interface RediscoveryProps {
  items: SavedItem[];
}

function pick(items: SavedItem[], exceptId?: string): SavedItem | undefined {
  if (items.length === 0) return undefined;
  if (items.length === 1) return items[0];
  let next = items[Math.floor(Math.random() * items.length)];
  // avoid repeating the same item back-to-back
  while (next.id === exceptId) {
    next = items[Math.floor(Math.random() * items.length)];
  }
  return next;
}

/**
 * One forgotten save, surfaced for the "I forgot I saved this" moment. Reshuffle
 * to wander the archive. (A dedicated dormant-content lens is M7.)
 */
export function Rediscovery({ items }: RediscoveryProps) {
  const [item, setItem] = useState<SavedItem | undefined>(() => pick(items));

  if (!item) return null;

  const age = relativeAge(item.savedAt);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-edge bg-surface p-4">
      <p className="text-sm text-muted">
        You saved this{age ? ` ${age}` : ""}.
      </p>
      <div>
        <p className="text-sm font-medium text-white">
          {item.creator ?? "Unknown creator"}
        </p>
        {item.description && (
          <p className="mt-1 line-clamp-3 whitespace-pre-line text-sm text-white/80">
            {item.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm">
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-muted transition-colors hover:text-white"
          >
            Open →
          </a>
        )}
        <button
          onClick={() => setItem((current) => pick(items, current?.id))}
          className="text-muted transition-colors hover:text-white"
        >
          Show another
        </button>
      </div>
    </div>
  );
}

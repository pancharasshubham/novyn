"use client";

import { useState } from "react";
import { SavedItemCard } from "@/components/SavedItemCard";
import type { SavedItem } from "@/types/saved-item";
import { randomSave } from "../discovery";

interface RediscoverProps {
  items: SavedItem[];
}

/**
 * One random saved item the user can reshuffle — the "I forgot I saved this"
 * hook that makes the library feel worth returning to.
 */
export function Rediscover({ items }: RediscoverProps) {
  const [pick, setPick] = useState<SavedItem | undefined>(() =>
    randomSave(items),
  );

  if (!pick) return null;

  return (
    <div className="flex flex-col gap-2">
      <ul className="divide-y divide-edge overflow-hidden rounded-2xl border border-edge bg-surface">
        <SavedItemCard key={pick.id} item={pick} />
      </ul>
      <button
        onClick={() => setPick(randomSave(items))}
        className="self-start rounded-lg border border-edge px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-white"
      >
        Shuffle
      </button>
    </div>
  );
}

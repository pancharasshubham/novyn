"use client";

import { useState } from "react";
import { SavedItemCard } from "@/components/SavedItemCard";
import type { AttentionObservation } from "../observations";

interface ObservationProps {
  observation: AttentionObservation;
  onOpen: (term: string) => void;
}

/**
 * One observation. Collapsed by default so the page reads as a few sentences,
 * not a wall of cards. The evidence (real saves) expands inline on demand —
 * turning passive scrolling into deliberate inspection.
 */
export function Observation({ observation, onOpen }: ObservationProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 border-b border-edge py-5">
      <p className="text-base leading-relaxed text-white/90">
        {observation.text}
      </p>
      <div className="flex items-center gap-5 text-sm">
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-muted transition-colors hover:text-white"
        >
          {open ? "Hide evidence" : "Show evidence"}
        </button>
        <button
          onClick={() => onOpen(observation.term)}
          className="text-muted transition-colors hover:text-white"
        >
          See all →
        </button>
      </div>
      {open && observation.evidence.length > 0 && (
        <ul className="mt-2 divide-y divide-edge overflow-hidden rounded-2xl border border-edge bg-surface">
          {observation.evidence.map((item) => (
            <SavedItemCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}

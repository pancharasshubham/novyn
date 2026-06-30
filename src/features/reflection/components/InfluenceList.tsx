"use client";

import type { CreatorInfluence } from "@/features/attention/attention";

interface InfluenceListProps {
  creators: CreatorInfluence[];
  onPick: (term: string) => void;
}

/**
 * Influences as evidence, not a leaderboard: who recurs, and over how long.
 * Each row opens that creator's saves so the influence is inspectable.
 */
export function InfluenceList({ creators, onPick }: InfluenceListProps) {
  if (creators.length === 0) return null;

  return (
    <ul className="flex flex-col">
      {creators.map((creator) => {
        const title = creator.name ?? `@${creator.username}`;
        const term = creator.username ?? creator.name ?? title;
        return (
          <li key={creator.username ?? creator.name ?? title}>
            <button
              onClick={() => onPick(term)}
              className="w-full border-b border-edge py-3 text-left transition-colors hover:text-white"
            >
              <p className="truncate text-sm font-medium text-white">{title}</p>
              <p className="text-xs text-muted">
                {creator.count} saves
                {creator.monthCount > 1 ? ` over ${creator.monthCount} months` : ""}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

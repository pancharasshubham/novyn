"use client";

import type { CreatorSummary } from "../discovery";

interface TopCreatorsProps {
  creators: CreatorSummary[];
  onPick: (term: string) => void;
}

/**
 * The creators a user saves most. Clicking one runs a search for them, turning
 * "I save this person a lot" into a one-tap way to revisit everything of theirs.
 */
export function TopCreators({ creators, onPick }: TopCreatorsProps) {
  if (creators.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {creators.map((creator) => {
        const title = creator.name ?? `@${creator.username}`;
        const term = creator.username ?? creator.name ?? title;
        return (
          <li key={title}>
            <button
              onClick={() => onPick(term)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-edge bg-surface px-4 py-3 text-left transition-colors hover:border-accent"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-white">
                  {title}
                </span>
                {creator.name && creator.username && (
                  <span className="block truncate text-xs text-muted">
                    @{creator.username}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-xs text-muted">
                {creator.count} {creator.count === 1 ? "save" : "saves"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

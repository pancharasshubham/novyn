"use client";

import type { InterestPattern } from "../attention";
import { InterestCard } from "./InterestCard";

interface RecurringAttentionProps {
  interests: InterestPattern[];
  onPick: (term: string) => void;
}

/** Grid of the interests a user returns to most. */
export function RecurringAttention({
  interests,
  onPick,
}: RecurringAttentionProps) {
  if (interests.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {interests.map((interest) => (
        <InterestCard key={interest.term} interest={interest} onPick={onPick} />
      ))}
    </div>
  );
}

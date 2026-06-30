"use client";

import { formatMonthYear } from "@/features/search/stats";
import type { InterestPattern } from "../attention";

interface InterestCardProps {
  interest: InterestPattern;
  onPick: (term: string) => void;
}

/**
 * One recurring interest, framed as an observation with its evidence on the
 * card. Clicking it searches the term so the user can see every save behind it.
 */
export function InterestCard({ interest, onPick }: InterestCardProps) {
  const kicker = interest.consistent
    ? "Consistent interest"
    : "Recurring attention";
  const first = formatMonthYear(interest.firstSavedAt);
  const latest = formatMonthYear(interest.lastSavedAt);

  return (
    <button
      onClick={() => onPick(interest.term)}
      className="flex flex-col gap-2 rounded-2xl border border-edge bg-surface p-4 text-left transition-colors hover:border-accent"
    >
      <span className="text-[11px] font-medium uppercase tracking-widest text-accent">
        {kicker}
      </span>
      <span className="text-lg font-semibold text-white">{interest.label}</span>
      <span className="text-sm text-muted">
        {interest.saveCount.toLocaleString()} saves · {interest.monthCount}{" "}
        {interest.monthCount === 1 ? "month" : "months"} · {interest.creatorCount}{" "}
        {interest.creatorCount === 1 ? "creator" : "creators"}
      </span>
      {first && latest && (
        <span className="text-xs text-muted">
          {first === latest ? first : `${first} → ${latest}`}
        </span>
      )}
    </button>
  );
}

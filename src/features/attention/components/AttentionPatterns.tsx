"use client";

import { useMemo } from "react";
import type { SavedItem } from "@/types/saved-item";
import { analyzeCreators, analyzeInterests, buildSignals } from "../attention";
import { AttentionSignals } from "./AttentionSignals";
import { RecurringAttention } from "./RecurringAttention";

interface AttentionPatternsProps {
  items: SavedItem[];
  onPick: (term: string) => void;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * The attention-patterns block of the home: what the user returns to, and the
 * evidence-only observations behind it. Interests are analyzed once and reused
 * for both the cards and the signals.
 */
export function AttentionPatterns({ items, onPick }: AttentionPatternsProps) {
  const interests = useMemo(() => analyzeInterests(items, 8), [items]);
  const creators = useMemo(() => analyzeCreators(items, 2), [items]);
  const signals = useMemo(
    () => buildSignals(interests.slice(0, 3), creators),
    [interests, creators],
  );

  // Nothing recurs enough to be worth showing (e.g. a tiny library).
  if (interests.length === 0) return null;

  return (
    <>
      <Section title="Recurring attention">
        <RecurringAttention interests={interests} onPick={onPick} />
      </Section>

      <Section title="What keeps showing up">
        <AttentionSignals signals={signals} />
      </Section>
    </>
  );
}

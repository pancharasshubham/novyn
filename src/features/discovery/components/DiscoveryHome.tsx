"use client";

import { useMemo } from "react";
import { SavedItemCard } from "@/components/SavedItemCard";
import { AttentionPatterns } from "@/features/attention/components/AttentionPatterns";
import type { SavedItem } from "@/types/saved-item";
import { libraryStats, recentSaves, topCreators } from "../discovery";
import { QuickStats } from "./QuickStats";
import { Rediscover } from "./Rediscover";
import { TopCreators } from "./TopCreators";

interface DiscoveryHomeProps {
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
 * The post-import home: reassurance that the import worked, plus a few ways in.
 * Shown whenever the search field is empty — discovery is the default, search
 * is the tool.
 */
export function DiscoveryHome({ items, onPick }: DiscoveryHomeProps) {
  const recent = useMemo(() => recentSaves(items, 8), [items]);
  const creators = useMemo(() => topCreators(items, 8), [items]);
  const stats = useMemo(() => libraryStats(items), [items]);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-white">
          {stats.total.toLocaleString()} saved posts imported.
        </h1>
        <p className="text-sm text-muted">Your saved content is ready.</p>
      </header>

      <Section title="Recent saves">
        <ul className="divide-y divide-edge overflow-hidden rounded-2xl border border-edge bg-surface">
          {recent.map((item) => (
            <SavedItemCard key={item.id} item={item} />
          ))}
        </ul>
      </Section>

      <AttentionPatterns items={items} onPick={onPick} />

      <Section title="Top creators">
        <TopCreators creators={creators} onPick={onPick} />
      </Section>

      <Section title="At a glance">
        <QuickStats stats={stats} />
      </Section>

      <Section title="Rediscover">
        <Rediscover items={items} />
      </Section>
    </div>
  );
}

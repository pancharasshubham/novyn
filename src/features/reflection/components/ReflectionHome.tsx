"use client";

import { useMemo } from "react";
import { analyzeCreators, analyzeInterests } from "@/features/attention/attention";
import { libraryStats, recentSaves } from "@/features/discovery/discovery";
import type { SavedItem } from "@/types/saved-item";
import { buildObservations, coreReflectionText } from "../observations";
import { CoreReflection } from "./CoreReflection";
import { InfluenceList } from "./InfluenceList";
import { ObservationList } from "./ObservationList";
import { RecentSaves } from "./RecentSaves";
import { Rediscovery } from "./Rediscovery";

interface ReflectionHomeProps {
  items: SavedItem[];
  onPick: (term: string) => void;
}

function RailSection({
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
 * The reflection home: a synthesized core observation, then a reading column of
 * recurring-attention observations (primary) beside a rail of influences, recent
 * saves, and rediscovery (secondary). No carousels — meaning over browsing.
 */
export function ReflectionHome({ items, onPick }: ReflectionHomeProps) {
  const view = useMemo(() => {
    const interests = analyzeInterests(items, 6);
    const stats = libraryStats(items);
    return {
      core: coreReflectionText(
        interests,
        stats.total,
        stats.oldestSavedAt,
        stats.newestSavedAt,
      ),
      observations: buildObservations(items, interests),
      creators: analyzeCreators(items, 8),
      recent: recentSaves(items, 5),
    };
  }, [items]);

  return (
    <div className="flex flex-col gap-10">
      <CoreReflection text={view.core} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.7fr_1fr]">
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
            Recurring attention
          </h2>
          <ObservationList observations={view.observations} onOpen={onPick} />
        </section>

        <aside className="flex flex-col gap-10">
          <RailSection title="Influences">
            <InfluenceList creators={view.creators} onPick={onPick} />
          </RailSection>
          <RailSection title="Recent saves">
            <RecentSaves items={view.recent} />
          </RailSection>
          <RailSection title="Rediscovery">
            <Rediscovery items={items} />
          </RailSection>
        </aside>
      </div>
    </div>
  );
}

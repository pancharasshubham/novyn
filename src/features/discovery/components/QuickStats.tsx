"use client";

import { formatMonthYear } from "@/features/search/stats";
import type { LibraryStats } from "../discovery";

interface QuickStatsProps {
  stats: LibraryStats;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-edge bg-surface px-4 py-3">
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

/** Four plain numbers about the library — no charts, no KPIs. */
export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Stat value={stats.total.toLocaleString()} label="saved posts" />
      <Stat
        value={stats.creatorCount.toLocaleString()}
        label="creators"
      />
      <Stat
        value={formatMonthYear(stats.oldestSavedAt) || "—"}
        label="oldest save"
      />
      <Stat
        value={formatMonthYear(stats.newestSavedAt) || "—"}
        label="newest save"
      />
    </div>
  );
}

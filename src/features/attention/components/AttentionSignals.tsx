"use client";

import type { AttentionSignal } from "../attention";

interface AttentionSignalsProps {
  signals: AttentionSignal[];
}

/**
 * Plain observations, one per line. Each restates evidence already visible in
 * the cards above — never a conclusion about who the user is.
 */
export function AttentionSignals({ signals }: AttentionSignalsProps) {
  if (signals.length === 0) return null;

  return (
    <ul className="flex flex-col divide-y divide-edge overflow-hidden rounded-2xl border border-edge bg-surface">
      {signals.map((signal) => (
        <li
          key={signal.text}
          className="flex items-start gap-3 px-4 py-3 text-sm text-white/90"
        >
          <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          {signal.text}
        </li>
      ))}
    </ul>
  );
}

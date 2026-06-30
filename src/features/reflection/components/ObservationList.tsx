"use client";

import type { AttentionObservation } from "../observations";
import { Observation } from "./Observation";

interface ObservationListProps {
  observations: AttentionObservation[];
  onOpen: (term: string) => void;
}

/** The reading spine of the home: recurring-attention observations, stacked. */
export function ObservationList({ observations, onOpen }: ObservationListProps) {
  if (observations.length === 0) {
    return (
      <p className="text-sm text-muted">
        Not enough saved yet to see what keeps returning. Save more, then come
        back.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {observations.map((observation) => (
        <Observation
          key={observation.id}
          observation={observation}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

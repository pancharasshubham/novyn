"use client";

interface SearchSuggestionsProps {
  recent: string[];
  examples: string[];
  tags: string[];
  onPick: (term: string) => void;
  onClearRecent: () => void;
}

function Chips({
  items,
  onPick,
  prefix,
}: {
  items: string[];
  onPick: (term: string) => void;
  prefix?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onPick(item)}
          className="rounded-full border border-edge bg-surface px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-white"
        >
          {prefix}
          {item}
        </button>
      ))}
    </div>
  );
}

/**
 * What we show before the user types: a way back into recent searches, a few
 * example queries, and the user's own most-saved hashtags. The point is
 * rediscovery — "I know I saved this" — not a blank screen.
 */
export function SearchSuggestions({
  recent,
  examples,
  tags,
  onPick,
  onClearRecent,
}: SearchSuggestionsProps) {
  return (
    <div className="flex flex-col gap-6">
      {recent.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Recent
            </p>
            <button
              onClick={onClearRecent}
              className="text-xs text-muted transition-colors hover:text-white"
            >
              Clear
            </button>
          </div>
          <Chips items={recent} onPick={onPick} />
        </section>
      )}

      <section className="flex flex-col gap-2">
        <p className="px-1 text-xs font-medium uppercase tracking-widest text-muted">
          Try
        </p>
        <Chips items={examples} onPick={onPick} />
      </section>

      {tags.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="px-1 text-xs font-medium uppercase tracking-widest text-muted">
            Your top hashtags
          </p>
          <Chips items={tags} onPick={onPick} prefix="#" />
        </section>
      )}
    </div>
  );
}

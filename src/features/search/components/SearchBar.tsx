"use client";

const EXAMPLES = ["AI", "startup", "claude", "automation"];

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * The primary action of NOVYN: a large, Spotlight-style search field with
 * one-tap example queries beneath it.
 */
export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search your saved content..."
          aria-label="Search your saved content"
          className="w-full rounded-2xl border border-edge bg-surface py-4 pl-12 pr-4 text-lg text-white placeholder:text-muted focus:border-accent focus:outline-none"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-1 text-sm text-muted">
        <span className="text-muted/60">Try</span>
        {EXAMPLES.map((example, i) => (
          <span key={example} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted/40">•</span>}
            <button
              onClick={() => onChange(example)}
              className="transition-colors hover:text-accent"
            >
              {example}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

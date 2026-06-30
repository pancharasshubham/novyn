"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  /** Smaller, header-friendly sizing (used when search is a utility, not the page). */
  compact?: boolean;
  autoFocus?: boolean;
}

/**
 * The search field. Large by default; `compact` shrinks it for the home top bar
 * where search is a utility rather than the centerpiece.
 */
export function SearchBar({
  value,
  onChange,
  compact = false,
  autoFocus = false,
}: SearchBarProps) {
  const input = compact
    ? "py-2.5 pl-10 pr-10 text-sm"
    : "py-4 pl-12 pr-16 text-lg";
  const icon = compact ? "left-3 h-4 w-4" : "left-4 h-5 w-5";

  return (
    <div className="relative">
      <svg
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${icon}`}
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
        autoFocus={autoFocus}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your saved content..."
        aria-label="Search your saved content"
        className={`w-full rounded-2xl border border-edge bg-surface text-white placeholder:text-muted focus:border-accent focus:outline-none ${input}`}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className={`absolute top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-white ${compact ? "right-3 text-xs" : "right-4 text-sm"}`}
        >
          Clear
        </button>
      )}
    </div>
  );
}

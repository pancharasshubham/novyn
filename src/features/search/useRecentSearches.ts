"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * The last few searches, remembered across reloads in localStorage. No database,
 * no account — this is a single-user personal tool, so the browser is the store.
 */

const STORAGE_KEY = "novyn.recentSearches";
const MAX_RECENT = 5;

export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  // Load once on mount (localStorage isn't available during SSR).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecent(
          parsed.filter((x) => typeof x === "string").slice(0, MAX_RECENT),
        );
      }
    } catch {
      // Corrupt or unavailable storage — start empty, no crash.
    }
  }, []);

  const record = useCallback((term: string) => {
    const trimmed = term.trim();
    if (trimmed.length < 2) return; // ignore noise like single keystrokes

    setRecent((prev) => {
      const next = [
        trimmed,
        ...prev.filter((x) => x.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Persisting is best-effort.
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { recent, record, clear };
}

"use client";

import { useState } from "react";
import { DropZone } from "@/features/import/components/DropZone";
import { importFile } from "@/features/import/importFile";
import { savedItemStore } from "@/features/import/store";
import { SearchView } from "@/features/search/components/SearchView";
import type { SavedItem } from "@/types/saved-item";

export default function ImportPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    setIsImporting(true);

    const result = await importFile(file);

    setIsImporting(false);

    if (result.ok) {
      setItems(result.items);
    } else {
      setError(result.error);
    }
  }

  function handleReset() {
    savedItemStore.clear();
    setItems([]);
    setError(null);
  }

  // Once content is imported, search becomes the primary action.
  if (items.length > 0) {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <header className="mb-6">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            NOVYN
          </p>
        </header>
        <SearchView items={items} onReset={handleReset} />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          NOVYN
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">
          Import your saved content
        </h1>
        <p className="mt-2 text-sm text-muted">
          Start with your Instagram saved posts. Request your data from
          Instagram, then drop the <code className="text-white">saved_posts.json</code>{" "}
          file below.
        </p>
      </header>

      <DropZone onFile={handleFile} disabled={isImporting} />
      {isImporting && (
        <p className="mt-4 text-center text-sm text-muted">Reading file…</p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          {error}
        </p>
      )}
    </main>
  );
}

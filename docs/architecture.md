# System Architecture

Instagram JSON export (top-level array)
        ↓
Validation        (file type + light shape check)
        ↓
Parser            (caption, creator, username, hashtags, timestamp, url)
        ↓
Normalizer        (→ SavedItem · mojibake repair · de-dupe)
        ↓
In-memory store   (module singleton — the single Supabase-replacement seam)
        ↓
Client-side engines
   • Search        keyword · substring · multi-word · precomputed index
   • Attention     recurring interests · consistency · creator influence
        ↓
Reflection home (UI)

---

## SavedItem (source-agnostic)

```ts
type SavedItem = {
  id: string
  source: "instagram"
  mediaType?: "reel" | "post"
  title?: string
  description?: string      // caption
  creator?: string          // display name
  creatorUsername?: string  // handle, no @
  url?: string
  savedAt?: string          // ISO 8601
  tags: string[]            // hashtags
  rawData?: unknown
}
```

Every engine reads only `SavedItem`, so future parsers (YouTube, bookmarks,
LinkedIn) light up the whole product with no UI changes.

---

## Layers

**Import** — receives the JSON file, validates type and shape.

**Parser** — extracts fields from the nested `label_values` groups.

**Normalizer** — converts to `SavedItem`, repairs double-encoded text, de-dupes.

**Store** — in-memory only. No database is wired; this module is the one place a
real datastore would later slot in.

**Search engine** — keyword search over a precomputed text index. No external
library, no embeddings.

**Attention engine** — counts recurring interests, measures consistency over
time, and ranks creator influence. Pure functions, fully explainable.

**Reflection UI** — observations first, content as evidence on demand.

---

## Principles

- No database, no auth, no AI / LLM, no embeddings, no backend services.
- Everything runs client-side and is explainable.
- Only Instagram is implemented; the architecture allows future parsers.
- Observation → Evidence. Every insight is backed by saves the user can open.

# System Architecture

Instagram JSON
        ↓
Parser
        ↓
Normalizer
        ↓
SavedItem
        ↓
Database
        ↓
Search Engine
        ↓
Insights Engine
        ↓
UI

Layers
Import Layer

Receives JSON.

Parser

Extract:

captions
creator
timestamps
urls

Normalizer
Convert to:
type SavedItem = {
  id: string
  source: string
  title?: string
  creator?: string
  url?: string
  savedAt?: string
  tags: string[]
}

Search Engine
Keyword search.

Insight Engine
topic detection
interest analysis
trend analysis

UI
search
timeline
insights
# MindWell — Project Memory

## App Identity
- App: **MindWell** (renamed from Reading Tracker → BookClub → MindWell)
- PWA manifest, layout metadata, header updated

## Tech Stack
- Next.js App Router, TypeScript, Tailwind CSS v4
- Supabase for data (books, book_notes, quotes, connections)
- @dnd-kit for drag-and-drop (book reorder within sections)
- next/font/google: Geist (body) + Lora (serif headings)
- jspdf for PDF export
- date-fns for date formatting

## Design System — Light Editorial (fog/navy/ember)
Defined in `app/globals.css` via `@theme`:

**Fog scale** (light blue-gray backgrounds):
- fog-200 #e8edf2 (page bg) / fog-300 #dde4ed (borders) / fog-400 #c2cedb (muted borders)
- fog-500 #8fa5bc (muted text) / fog-600 #637d97 (secondary text)

**Navy scale** (deep blue accents):
- navy-100 #d5e0ed / navy-300 #7aa0c0 / navy-500 #2d6090
- navy-600 #1e4a7a / navy-700 #1a3a6b (primary buttons, headings) / navy-900 #0d1e35

**Ember scale** (deep amber accents):
- ember-100 #fae3c0 / ember-300 #e8a83e / ember-500 #c47209 (progress bars, amber accent)
- ember-600 #b5620a / ember-700 #8f4c08

## Key UI Patterns

### Colors
- Page bg: `bg-fog-200`
- Card bg: `bg-white` + `border border-fog-300 shadow-sm` (hover: `border-fog-400 shadow-md`)
- Primary text: `text-navy-900`
- Muted text: `text-fog-500` / `text-fog-600`
- Primary button: `bg-navy-700 hover:bg-navy-800 text-white`
- Secondary button: `bg-fog-100 hover:bg-fog-200 text-navy-700`
- Progress bar: `bg-ember-500`
- Save indicator: `text-ember-500`
- Complete button: `hover:bg-navy-700 hover:text-white`

### Tags (light theme palettes)
`bg-blue-100 text-blue-700 border-blue-200` (and violet/emerald/amber/rose/teal/indigo/orange variants)

### Tabs
- Active: `border-b-2 border-navy-700 text-navy-700 font-semibold`
- Inactive: `border-transparent text-fog-500 hover:text-navy-500`

### Modal Style
`bg-white rounded-2xl shadow-[0_24px_80px_rgba(14,30,53,0.2)]`

### Form Inputs
`bg-fog-100 border border-fog-300 rounded-lg focus:ring-2 focus:ring-navy-500/20`

### Section Headers
`text-[11px] font-bold uppercase tracking-widest text-fog-500`

## Dashboard Layout (app/page.tsx)
- **Reading Now** section: active books, sortable DnD
- **Articles** section: active articles
- **Podcasts** section: active podcasts (shown if any)
- **Next Up** section: queued books, collapsible, sortable DnD
- **Completed Books** / **Completed Articles** / **Completed Podcasts**: each shows 3 most recent with "Show more"
- Single "+" header button → AddItemModal (Book/Article/Podcast tabs)
- Book/Article/Podcast cards: title clickable → opens DetailModal (via URL param)
- No Edit/Notes buttons on cards — everything goes through DetailModal
- URL state: `/?book=<id>&tab=<tab>` opens DetailModal
- Uses Suspense wrapper for useSearchParams

## Item Types
- **Book**: Title, Author, Total Pages, Current Page → progress bar shown
- **Article**: Title, Author, Publication, Date
- **Podcast**: Episode Title (stored as title), Show Title, Guests, Air Date

## BookStatus: `'active' | 'completed' | 'paused' | 'queued'`
## BookType: `'book' | 'article' | 'podcast'`

## DB New Columns (requires migration: supabase-migration.sql)
`author`, `publication`, `article_date`, `show_title`, `guests`, `air_date`
Also: type constraint must include 'podcast'

## Notes System
- Tabs: Outline / Brainstorm / Quotes
- "Brainstorm" tab stored as `tab='scratch'` in DB (display name differs from DB key)
- Autosave with 600ms debounce

## File Structure
- `app/globals.css` — @theme: fog + navy + ember scales
- `app/layout.tsx` — fonts, MindWell metadata, bg-fog-200 text-navy-900
- `app/page.tsx` — Dashboard (Suspense-wrapped, DnD, URL-based modal)
- `app/books/[id]/page.tsx` — Redirects to `/?book=<id>&tab=<tab>`
- `app/api/books/route.ts` — GET/POST (podcast fields supported)
- `app/api/books/[id]/route.ts` — GET/PATCH/DELETE
- `app/api/books/[id]/complete/route.ts` — POST mark complete
- `app/api/books/reorder/route.ts` — PATCH update sort_order
- `app/api/search/route.ts` — text search (quotes + notes)
- `app/api/tag-search/route.ts` — GET ?tag=xxx
- `app/api/export/pdf/[bookId]/route.ts` — book notes PDF
- `app/api/export/tag-search/route.ts` — tag search PDF
- `components/AddItemModal.tsx` — unified +Book/+Article/+Podcast modal
- `components/DetailModal.tsx` — detail popup (metadata + Outline/Brainstorm/Quotes tabs + PDF)
- `components/GlobalSearch.tsx` — search overlay, navigates to /?book=id&tab=tab
- `components/OutlineEditor.tsx` — outline textarea with auto-prefix, accepts className prop
- `components/Quotes.tsx` — quotes with always-visible inline tags, no expand/collapse
- `components/Modal.tsx` — shared modal wrapper (legacy, not actively used)
- `lib/supabase.ts` — DB helpers
- `lib/export.ts` — generateNotesPDF (uses "Brainstorm" label)
- `types/index.ts` — Book, BookNote, Quote, Connection, SearchResult
- `supabase-migration.sql` — SQL to run for podcast support

## Required DB Migrations (supabase-migration.sql)
```sql
ALTER TABLE books ADD COLUMN IF NOT EXISTS author text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS publication text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS article_date text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS show_title text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS guests text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS air_date text;
ALTER TABLE books DROP CONSTRAINT IF EXISTS books_type_check;
ALTER TABLE books ADD CONSTRAINT books_type_check CHECK (type IN ('book', 'article', 'podcast'));
```
Also: quotes table needs `tags text[] DEFAULT '{}'`
Connections table as documented in old memory.

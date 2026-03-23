# Add Folder Assignment to Homepage Cards

## Context
The `folder_name` text column already exists in the database (migration 008). This plan adds the UI to assign, display, and remove folders directly on the collapsed book/article/podcast cards on the homepage.

## Files to Modify

1. **`types/index.ts`** — Add `folder_name: string | null` to the `Book` interface
2. **`app/home/page.tsx`** — Add a `FolderPicker` component and integrate it into `SortableBookRow`, `ArticleCard`, and `PodcastCard`

## Implementation

### 1. Update `Book` type (`types/index.ts`)
- Add `folder_name: string | null` to the `Book` interface under the "Common" section

### 2. Create `FolderPicker` inline component (`app/home/page.tsx`)

A self-contained component at the top of the file (alongside `DragHandle`, `CompleteButton`, etc.) with these props:
- `book: Book` — the current book
- `allBooks: Book[]` — to derive existing folder names
- `onAssign: (bookId: string, folderName: string | null) => Promise<void>` — callback to persist

**Behavior:**
- Renders a small folder icon button (similar size to `CompleteButton`, ~`w-7 h-7`)
- On click, toggles an absolutely-positioned dropdown below/above the button
- Dropdown contents:
  - "Add to new folder…" at top — clicking reveals an inline text input + confirm button
  - Divider
  - List of unique `folder_name` values from `allBooks` (sorted alphabetically), each clickable
- Selecting a folder or confirming a new name calls `onAssign(book.id, folderName)`
- Click outside or Escape closes the dropdown
- Dropdown uses `z-50` to float above cards

### 3. Add folder pill/tag display

When `book.folder_name` is set, show a small amber pill on the card:
- Styled: `inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200`
- Shows the folder name text + a small `×` button
- Clicking `×` calls `onAssign(book.id, null)` to remove the folder

### 4. Integrate into card components

**`SortableBookRow`** — Add new props `allBooks` and `onAssignFolder`. Place folder pill after the author line (inside the clickable content area, below author). Place the `FolderPicker` icon button between the clickable content and the action button (Complete/Start). The pill's `×` button uses `e.stopPropagation()` to prevent opening detail.

**`ArticleCard`** — Same pattern: folder pill in content area, `FolderPicker` button before `CompleteButton`.

**`PodcastCard`** — Same pattern.

### 5. Add handler in `DashboardContent`

```ts
async function handleAssignFolder(bookId: string, folderName: string | null) {
  setBooks(prev => prev.map(b => b.id === bookId ? { ...b, folder_name: folderName } : b))
  await fetch(`/api/books/${bookId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder_name: folderName }),
  })
}
```

Optimistic update (update local state immediately, then persist). This follows the existing pattern used by `handleMoveUp`.

Pass `books` and `handleAssignFolder` down to each card.

## Verification
- Run `npm run dev` and open the homepage
- Verify folder icon appears on each card type (book, article, podcast)
- Click the icon, confirm dropdown appears with "Add to new folder…"
- Type a new folder name and confirm — verify amber pill appears on the card
- Add a second item to the same folder — verify the folder appears in the dropdown list
- Click `×` on the pill — verify folder is removed
- Refresh the page — verify folder assignments persist

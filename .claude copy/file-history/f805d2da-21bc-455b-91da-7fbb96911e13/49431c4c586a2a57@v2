# Plan: Google OAuth + Supabase Auth + RLS

## Context
MindWell is a single-user reading tracker using Supabase with "allow all" RLS policies.
Migration 004 added nullable `user_id` columns. Now we need to wire up Google OAuth, claim
existing null-user_id rows on first sign-in, enforce user-scoped RLS, and add a sign-out button.

## Package to Install
`@supabase/ssr` — cookie-based auth that works in both browser and Next.js server contexts.

---

## Files to Create (6)

### 1. `supabase/migrations/005_add_rls_policies.sql`
- Add `user_id UUID` to `quote_headings` (missed in 004)
- Drop all existing "allow all" policies on every table
- Create user-scoped policies: `auth.uid() = user_id` on books, quotes, book_notes,
  connections, quote_headings, plus keep sessions/priority_items as "allow all" (unused)
- Create `claim_user_data(claiming_user_id UUID)` SECURITY DEFINER RPC:
  - Checks if user already has any books (count > 0 → skip, idempotent)
  - Otherwise: UPDATE all five tables WHERE user_id IS NULL → set user_id = claiming_user_id

### 2. `lib/supabase-server.ts`
Factory for server-side Supabase clients (API routes + route handlers):
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(URL, ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => toSet.forEach(c => cookieStore.set(c.name, c.value, c.options)),
    },
  })
}
```

### 3. `app/auth/callback/route.ts`
GET handler for Supabase OAuth redirect:
- Creates server client, calls `supabase.auth.exchangeCodeForSession(code)`
- Checks if user has any books with their user_id; if 0 → calls `claim_user_data` RPC
- Redirects to `/` (or `next` param) on success, `/login?error=...` on failure

### 4. `app/login/page.tsx`
- 'use client'
- On mount: if already signed in → redirect to `/`
- Shows MindWell title + "Sign in with Google" button
- Calls `supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: origin + '/auth/callback' })`
- Shows error if `?error=` in URL

### 5. `components/AuthProvider.tsx`
- 'use client', creates context with `{ user, signOut }`
- Subscribes to `supabase.auth.onAuthStateChange`
- `signOut`: calls `supabase.auth.signOut()` then `router.push('/login')`

### 6. `middleware.ts` (project root)
- Uses `createServerClient` with the Next.js middleware cookie pattern
- Calls `supabase.auth.getUser()` on every request to refresh session
- If no user and path is not `/login` or `/auth/**`: redirect to `/login`
- Matcher: `['/((?!_next/static|_next/image|favicon.ico|.*\\.png).*)']`

---

## Files to Modify (13)

### 7. `lib/supabase.ts`
Change ONE import + ONE line at the top:
```ts
// Before:
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// After:
import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
```
All existing helper functions remain unchanged.

### 8. `app/layout.tsx`
Wrap children with AuthProvider (inside PWAProvider).

### 9. `app/page.tsx` (header, lines 618–642)
Import `useAuth` from AuthProvider. Add sign-out button to the right side of the header,
between Search and Add buttons. Small "Sign out" text button or icon.

### 10. `app/completed/page.tsx` (header, lines 91–107)
Add sign-out button to the right side of the Completed Media header.

### 11–24. All 14 API routes
Replace `import { supabase } from '@/lib/supabase'` and the module-level `supabase` usage
with `const supabase = await createSupabaseServerClient()` inside each handler.

Affected files:
- `app/api/books/route.ts`
- `app/api/books/[id]/route.ts`
- `app/api/books/[id]/complete/route.ts`
- `app/api/books/reorder/route.ts`
- `app/api/quotes/[id]/route.ts`
- `app/api/quote-headings/route.ts`
- `app/api/quote-headings/[id]/route.ts`
- `app/api/search/route.ts`
- `app/api/tag-search/route.ts`
- `app/api/connections/route.ts`
- `app/api/connections/[id]/route.ts`
- `app/api/export/pdf/[bookId]/route.ts`
- `app/api/export/tag-search/route.ts`
- `app/api/dev/clear/route.ts`

---

## Supabase Dashboard Steps (manual, post-migration)
1. Auth → Providers → Google: enable, paste OAuth Client ID + Secret
2. Auth → URL Configuration → add `http://localhost:3000/auth/callback` to Redirect URLs
3. Add production URL when deploying

---

## Verification
1. `npm run dev` → visit `/` → redirected to `/login`
2. Click "Sign in with Google" → Google OAuth → callback → redirected to `/`
3. All existing data visible (claimed via `claim_user_data`)
4. Sign out → redirected to `/login`
5. API routes return empty/401 for unauthenticated requests
6. Check Supabase dashboard → auth.users table has your user row

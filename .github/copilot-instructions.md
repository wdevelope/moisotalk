## AI coding guide for this repo (moisotalk)

Next.js 15 (App Router) + React 19 + Tailwind v4, with Supabase for Auth, DB, and Realtime. Turbopack drives dev/build.

### Architecture

- App Router under `src/app/`.
  - `src/app/page.tsx`: Home with hero, CTAs to `/signup`, `/login`, `/match`.
  - `src/app/signup/page.tsx`, `src/app/login/page.tsx`: auth UI; signup uses select fields for gender/age.
  - `src/app/match/page.tsx`: enqueue user and poll for a match.
  - `src/app/chat/[roomId]/page.tsx`: realtime chat via Supabase channels; sends via API.
  - `src/app/me/page.tsx`: My Page; shows profile basics and points.
  - `src/app/layout.tsx`: global header/footer, logo, metadata (SEO).
- Supabase clients
  - Browser: `src/lib/supabaseClient.ts` (uses `@supabase/ssr` createBrowserClient).
  - Server: `src/lib/server/supabase.ts` (uses `@supabase/ssr` createServerClient with cookie auth).
  - Service (server-only): `src/lib/server/supabaseService.ts` for privileged ops (not exposed to client).
- DB schema: `supabase/schema.sql` (tables, RLS policies, indices, matching RPC).
- Static assets in `public/` (use with `next/image`), logo at `/logo.png`.

### Data model (see `supabase/schema.sql`)

- `profiles(id, nickname, gender, age_group, points, created_at)` linked to `auth.users`.
- `chat_rooms(id, created_at, is_active)` and `chat_participants(room_id, user_id, joined_at)`.
- `messages(id, room_id, sender_id, content, created_at)`; index on `(room_id, created_at desc)`.
- `waiting_pool(user_id, enqueued_at)`; used for random matching.
- Policies: RLS enabled; self-only inserts/updates where appropriate; messages readable by room participants.
- RPC: `find_or_create_match(p_user uuid)` pairs two queued users, creates room + participants, and returns `room id`.
- RPC: `room_has_korean(p_room uuid)` returns whether any message contains Korean (used for rewards).

### API surface (Next route handlers)

- `POST /api/profiles` — create profile for the authenticated user (called after sign-up or first login).
- `POST /api/match/start` — upsert into `waiting_pool` for current user.
- `POST /api/match/try` — calls RPC to return `{ roomId }` if matched.
- `POST /api/match/cancel` — remove current user from `waiting_pool`.
- `POST /api/messages/send` — insert a message; server-side Korean detection and -1 point if Korean.
- `POST /api/chat/end` — if the room has no Korean, add +2 points to all participants; marks room inactive.

### Auth flows

- Sign-up: `signUpWithEmail` in `src/lib/auth.ts` calls Supabase Auth; then `/api/profiles` to insert into `profiles`.
- If email confirmation is required (no session), we stash pending profile in `localStorage` and finalize on first login via `ensurePendingProfile`.
- Client vs Server: server components by default; add `'use client'` for stateful/interactive pages.
- Login success returns to `/` (home). Header shows "마이페이지" and a client `LogoutButton` when authenticated.

### Styling & conventions

- Tailwind v4 tokens from `src/app/globals.css` via `@theme inline`:
  - Fonts wired from `next/font` (`--font-sans`, `--font-mono`); use `font-sans`, `font-mono`.
  - Brand colors via CSS vars/tokens: Primary #1DA1F2 (aqua blue), Accent #004E92 (navy), Surface #F7F9FB, Secondary colors: mint #10B981, purple #8B5CF6, orange #F59E0B.
  - Color usage: `bg-background text-foreground`, `bg-primary text-primary-foreground`, `text-accent`, `bg-surface`, `text-mint`, `text-purple`, `text-orange`.
- Theme system: Light/dark mode toggle with system preference detection
  - `ThemeProvider` context in `src/components/ThemeProvider.tsx` manages theme state
  - `ThemeToggle` component in header toggles between light/dark modes (☀️🌙 icons)
  - Dark mode colors: darker backgrounds (#0f1419), lighter accent (#4a90e2), adjusted secondary colors
  - CSS classes `.light` and `.dark` on `<html>` element control theme application
- Design system: Card-based layouts with `rounded-xl`, `border-primary/20`, surface backgrounds. Focus states with `focus:border-primary`. Hover transitions.
- Component patterns:
  - Feature cards with color variants (mint/purple/orange) via props
  - Forms with surface backgrounds, rounded borders, proper focus states
  - Chat UI with gradient backgrounds, message bubbles, color-coded status, backdrop-blur effects
- Header/footer live in `layout.tsx`; header uses `/logo.png` with conditional auth navigation and theme toggle.
- Fonts loaded in `src/app/layout.tsx` (Geist, Geist_Mono) and applied on `<body>`.
- Path alias `@/*` → `./src/*` (see `tsconfig.json`).

### Build & run

- Dev: `pnpm dev` (http://localhost:3000), Build: `pnpm build`, Start: `pnpm start`.
- Env (`.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE` (server-only).

### Realtime & matching notes

- Enable Realtime on `public.messages` in Supabase if not already; UI subscribes to `postgres_changes` INSERT for the room.
- Chat sends go through `/api/messages/send` (don't insert directly from the client to enforce points logic).
- Matching is optimistic via polling `/api/match/try` every ~1.5s after enqueuing; RPC pairs oldest two users.

### Gotchas

- PostgreSQL doesn’t support `CREATE POLICY IF NOT EXISTS`; use `DROP POLICY IF EXISTS` then `CREATE POLICY` (already in schema).
- RLS requires authenticated context; API routes use server client with cookies for user identity.
- Never expose `SUPABASE_SERVICE_ROLE` to the browser; use only in server code.
- Server components cannot use `next/dynamic({ ssr: false })`; put client logic in a `'use client'` component (e.g., `LogoutButton`).

Questions or gaps? If you need additional conventions (testing, linting, component patterns), ask and we’ll capture them here.

## AI coding guide for this repo (moisotalk)

Next.js 15 (App Router) + React 19 + Tailwind v4, with Supabase for Auth, DB, and Realtime. Turbopack drives dev/build.

### Architecture

- App Router under `src/app/`.
  - `src/app/page.tsx`: MoisoTalk home with hero + CTAs to `/signup`, `/login`, `/match`.
  - `src/app/signup/page.tsx`, `src/app/login/page.tsx`: email/password auth UI.
  - `src/app/match/page.tsx`: enqueue user and poll for a match.
  - `src/app/chat/[roomId]/page.tsx`: realtime chat via Supabase channels.
- Supabase clients
  - Browser: `src/lib/supabaseClient.ts` (uses `@supabase/ssr` createBrowserClient).
  - Server: `src/lib/server/supabase.ts` (uses `@supabase/ssr` createServerClient with cookie auth).
  - Service (server-only): `src/lib/server/supabaseService.ts` for privileged ops (not exposed to client).
- DB schema: `supabase/schema.sql` (tables, RLS policies, indices, matching RPC).
- Static assets in `public/` (use with `next/image` as `/file.svg`).

### Data model (see `supabase/schema.sql`)

- `profiles(id, nickname, gender, age_group, points, created_at)` linked to `auth.users`.
- `chat_rooms(id, created_at, is_active)` and `chat_participants(room_id, user_id, joined_at)`.
- `messages(id, room_id, sender_id, content, created_at)`; index on `(room_id, created_at desc)`.
- `waiting_pool(user_id, enqueued_at)`; used for random matching.
- Policies: RLS enabled; self-only inserts/updates where appropriate; messages readable by room participants.
- RPC: `find_or_create_match(p_user uuid)` pairs two queued users, creates room + participants, and returns `room id`.

### API surface (Next route handlers)

- `POST /api/profiles` — create profile for the authenticated user (called after sign-up or first login).
- `POST /api/match/start` — upsert into `waiting_pool` for current user.
- `POST /api/match/try` — calls RPC to return `{ roomId }` if matched.
- `POST /api/match/cancel` — remove current user from `waiting_pool`.

### Auth flows

- Sign-up: `signUpWithEmail` in `src/lib/auth.ts` calls Supabase Auth; then `/api/profiles` to insert into `profiles`.
- If email confirmation is required (no session), we stash pending profile in `localStorage` and finalize on first login via `ensurePendingProfile`.
- Client vs Server: server components by default; add `'use client'` for stateful/interactive pages.

### Styling & conventions

- Tailwind v4 tokens from `src/app/globals.css` via `@theme inline`:
  - Fonts wired from `next/font` (`--font-sans`, `--font-mono`); use `font-sans`, `font-mono`.
  - Colors via CSS vars: `bg-background text-foreground`.
- Fonts loaded in `src/app/layout.tsx` (Geist, Geist_Mono) and applied on `<body>`.
- Path alias `@/*` → `./src/*` (see `tsconfig.json`).

### Build & run

- Dev: `pnpm dev` (http://localhost:3000), Build: `pnpm build`, Start: `pnpm start`.
- Env (`.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE` (server-only).

### Realtime & matching notes

- Enable Realtime on `public.messages` in Supabase if not already; UI subscribes to `postgres_changes` INSERT for the room.
- Matching is optimistic via polling `/api/match/try` every ~1.5s after enqueuing; RPC pairs oldest two users.

### Gotchas

- PostgreSQL doesn’t support `CREATE POLICY IF NOT EXISTS`; use `DROP POLICY IF EXISTS` then `CREATE POLICY` (already in schema).
- RLS requires authenticated context; API routes use server client with cookies for user identity.
- Never expose `SUPABASE_SERVICE_ROLE` to the browser; use only in server code.

Questions or gaps? If you need additional conventions (testing, linting, component patterns), ask and we’ll capture them here.

<!-- Copilot / AI agent guidance for the DrillRecord repo -->
# Copilot Instructions — DrillRecord

Purpose: give AI coding agents the minimum, actionable knowledge to work productively in this Next.js + Supabase repository.

- **Big picture**: This is a Next.js (App Router) application (see `app/`) with a feature-driven layout under `features/`. UI primitives live under `ui/`, larger components under `components/`, and shared logic lives in `lib/`. Data persistence and auth are powered by Supabase (`lib/supabaseClient.ts` / `lib/supabaseBrowser.ts`) and a SQL schema in `supabase/schema.sql`.

- **Key directories & files** (start here):
  - `app/` — Next.js App Router routes, layouts and route groups. Note route-group folders like `app/(admin)` and `app/(marketing)`.
  - `components/` — composed React components and page sections used across the app.
  - `ui/` — small, reusable UI primitives (Radix + shadcn-style). Prefer these for new UI bits.
  - `features/` — feature modules. Each feature commonly contains `schemas.ts` (zod schemas), `types.ts`, `server.ts` (server-side handlers), and a `components/` subfolder. Follow the existing feature pattern.
  - `lib/` — shared clients and helpers. Important files:
    - `lib/supabaseClient.ts` — server-side Supabase client (uses `SUPABASE_SERVICE_ROLE_KEY`).
    - `lib/supabaseBrowser.ts` — client/browser Supabase instance (uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
    - `lib/auth/` — JWT helpers (`token.ts`) and other auth utilities.
  - `scripts/seed.ts` — DB seeding script. Uses env keys (see Env section).
  - `supabase/schema.sql` — canonical DB schema.

- **Data flow & server vs client rules**:
  - Server-only secrets (service role key, JWT secrets) are accessed only from server code. Use `lib/supabaseClient.ts` and server modules (e.g., `features/*/server.ts` or `app/api/*`) for operations requiring elevated keys.
  - Client code should import `lib/supabaseBrowser.ts` and only use `NEXT_PUBLIC_` env vars.
  - Typical pattern: validate input with `features/*/schemas.ts` (zod) on the server, then call Supabase via `lib/supabaseClient.ts`.

- **Naming & structural conventions** (observed in repo):
  - Feature modules follow `features/<name>/{schemas.ts,types.ts,server.ts,components/}`.
  - Server entry points often are `server.ts` in a feature, or `app/api/*` under the App Router.
  - UI primitives are in `ui/`; prefer them over bespoke markup for consistent behavior and theming.
  - Route groups use parentheses (e.g., `(admin)`) — respect group-level `layout.tsx` files when adding pages.

- **Environment variables (used in codebase)**:
  - `NEXT_PUBLIC_SUPABASE_URL` — public Supabase URL (client & server reads).
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key for client-side usage.
  - `SUPABASE_SERVICE_ROLE_KEY` — service role key for server operations (keep secret).
  - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — JWT signing secrets used in `lib/auth/token.ts`.
  - `NODE_ENV` — typical environment checks exist (e.g., `app/api/auth/_utils.ts`).

- **Dev & build workflows (explicit scripts)** — use these npm scripts from `package.json`:
  - `npm run dev` — start Next.js dev server (localhost:3000).
  - `npm run build` — build for production.
  - `npm run start` — run production build.
  - `npm run lint` — run ESLint.
  - `npm run seed` — runs `tsx scripts/seed.ts` to seed the DB (uses env vars above).

- **Important integrations & libs**:
  - Supabase (`@supabase/supabase-js`) — primary DB/auth backend.
  - `zod` — schema validation in feature `schemas.ts` files.
  - `argon2`, `jose`, `jsonwebtoken` — server-side auth/crypto; do not import into browser bundles.
  - Audio: `wavesurfer` / `wavesurfer-react` + `ffmpeg-static` + `sharp` used for audio processing and thumbnails.

- **Practical rules for edits**:
  - When adding DB-related server code, update `supabase/schema.sql` or `scripts/seed.ts` as applicable.
  - Avoid importing server-only packages (argon2, jose, ffmpeg) into `ui/` or components that are used client-side.
  - Validate input with existing `schemas.ts` zod schemas — many endpoints expect that shape.
  - Use `lib/supabaseBrowser.ts` for any client-side Supabase calls so the code uses public keys only.

- **Where to look for examples**:
  - `features/auth/` — auth flows (`AuthHydrator.ts`, `store.ts`) and token helpers in `lib/auth/`.
  - `lib/supabaseClient.ts` and `lib/supabaseBrowser.ts` — server vs browser supabase usage.
  - `scripts/seed.ts` — example usage of env vars and seeding pattern.

If anything here is unclear or you want more examples (for example, show how to add a new feature with `schemas.ts` + `server.ts` + UI), tell me which parts you want expanded and I will iterate.

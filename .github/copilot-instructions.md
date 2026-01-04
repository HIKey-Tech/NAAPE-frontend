## Purpose
Short, actionable guidance for AI coding agents working on this Next.js (app router) frontend.

Keep edits small and local—this repo uses Next.js App Router (app/) and Tailwind/shadcn-ui primitives.

### Quick facts
- Framework: Next.js (app directory, Next 16+). See `app/` and `next.config.ts`.
- Node: engines.node >= 20.9.0 (see `package.json`).
- Primary UI primitives: `components/ui/*` (shadcn-style), `components/navbar/*`.
- State: small global state via Zustand at `hook/store/useAuthStore.ts` and React Context at `context/provider/provider.tsx`.
- API routes / server code: `app/api/` and `api/` (server endpoints under `api/` directory).

### Build / dev / lint commands
- Dev: `npm run dev` (uses `next dev --webpack`).
- Build: `npm run build` (uses `next build --webpack`).
- Start production: `npm run start`.
- Lint: `npm run lint` (runs `eslint`).
- CI/deploy: Vercel action in `.github/workflows/vercel-deploy.yml` installs deps then runs `npm run build`.

When suggesting changes that affect build or runtime, prefer minimal incremental edits and ensure `npm run build` still succeeds.

### Project-specific patterns to follow
- App router: prefer file-based routing under `app/`. Many UI pages are server components by default. If a file needs client-side hooks or state, add `"use client"` at the top of that file.
- UI primitives: `components/ui/*` provide atomic components (button, input, popover). Reuse those instead of adding duplicate styles.
- Styling: Tailwind v4 and `class-variance-authority` are used — prefer CVA patterns already present in `components/ui/*`.
- Forms: `react-hook-form` + `@hookform/resolvers` is used; follow existing form patterns if adding forms (see `components/ui/form.tsx` and pages under `app/(auth)`).
- Auth: uses Clerk (`@clerk/nextjs`) and a local `useAuthStore` hook. Avoid duplicating auth logic; integrate with `context/provider/provider.tsx` and `hook/store/useAuthStore.ts`.
- Data fetching: the app uses server APIs under `api/` and client hooks in `hooks/` (for example `useNews.ts`, `useMembers.ts`). For client-side fetching prefer `@tanstack/react-query` patterns already used.

### Files and places to check before changing behavior
- Global layout and routing: `app/layout.tsx`, `app/globals.css`, `app/(public)/layout.tsx`, and `app/(private)/...` for member/admin areas.
- API endpoints: `api/*` (server-side logic) and `app/api/*` (edge/server handlers). Example: `api/news/` and `api/events/`.
- HTTP client: `lib/axios.ts` centralizes axios configuration—update it if you change auth headers or baseURL.
- Provider and auth wiring: `context/provider/provider.tsx` and `hook/store/useAuthStore.ts`.
- UI components: `components/ui/` (small primitives), `components/navbar/` (app navigation and sidebar patterns).

### Examples (explicit snippets to locate patterns)
- To make a client-only component: add `"use client"` at top and import hooks from `hooks/` or `hook/store/*`.
- To call the backend from a component: prefer existing hooks like `useNews.ts` or use `lib/axios.ts` so requests include consistent headers.
- To add a styled button: copy pattern from `components/ui/button.tsx` and use CVA classes rather than raw Tailwind strings.

### Do not assume
- There are no test scripts in `package.json`; do not add tests that change CI without coordinating.
- Avoid changing global Tailwind configuration unless necessary—many components rely on existing utility classes.

### Safety & verification checklist for PRs
1. Run `npm run dev` locally and smoke the affected page(s).
2. Run `npm run build` to ensure no server-side compile errors.
3. Run `npm run lint` to catch formatting or eslint issues.
4. If you change auth or API surface, check `lib/axios.ts`, `context/provider/provider.tsx`, and related hooks.

If anything here is unclear or you want more examples (specific components or hooks to reference), tell me which area and I'll expand the instructions.

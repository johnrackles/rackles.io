# agents.md

Personal website of Johannes ("John") Rackles — rackles.io. A small, static/SSR
personal site (intro, CV/PDF generation, imprint) built with Qwik and deployed
to Cloudflare Pages.

## Tech Stack

- **Framework**: Qwik + QwikCity (`@builder.io/qwik`, `@builder.io/qwik-city`)
- **Build tool**: Vite 7
- **Styling**: Tailwind CSS v4 + DaisyUI (via `@tailwindcss/vite`)
- **React interop**: `@builder.io/qwik-react` — used only for PDF generation
  (`@react-pdf/renderer`), not for site UI
- **Deployment**: Cloudflare Pages (via `wrangler`), adapter in
  `adapters/cloudflare-pages/`. Deploys run from GitHub Actions
  (`.github/workflows/test-and-deploy.yml`) after tests pass on push to
  `master` -- Cloudflare Pages' own Git integration/auto-builds should be
  disabled to avoid a second, untested deploy racing this one.
- **Lint/format**: Biome (`biome.json`, replaces ESLint/Prettier for JS/TS/JSON;
  Prettier is still used for Tailwind class sorting plugin)
- **Git hooks**: Lefthook — runs `biome check --write` on staged files at
  pre-commit
- **Unit/integration tests**: Vitest (`test/`)
- **E2E tests**: Playwright (`e2e/`) — used only where a real browser is
  needed (hydration, console/CSP-violation tracking)
- **Node**: v24 (see `.nvmrc`/`.node-version`, Volta pinned to node 24)

## Project Structure

```
src/
  routes/            QwikCity file-based routing
    index.tsx        Home page (intro, technologies, projects list)
    imprint/         /imprint/ page (German legal "Impressum")
    layout.tsx       Root layout: Header + main + Footer, sets cache-control
    plugin@csp.ts     Route middleware: sets CSP + security headers (prod only)
    service-worker.ts
  components/        Header, Footer, ThemeSelect (DaisyUI theme switcher), router-head
  content/
    cv-content.ts    Single source of truth for CV data, shared by web page
                     and PDF generator
  lib/dayjs.ts       dayjs instance/config
  entry.*.tsx        Qwik entry points (ssr, dev, preview, cloudflare-pages)
  generate-pdf.tsx   Script (uses React + @react-pdf/renderer) that renders
                     the CV as a PDF to public/CV_Johannes-Rackles.pdf
  global.css         Tailwind + DaisyUI entry
adapters/cloudflare-pages/vite.config.ts   Cloudflare-specific Vite build config
server/              Build output for the SSR server (generated)
dist/                Client build output (generated, deployed to CF Pages)
test/
  unit/              Vitest unit tests — no build/server needed, fastest
  integration/        Vitest tests against a built preview server (HTTP-only
                     checks: pages, PDF, 404, security headers)
e2e/                 Playwright tests (fixtures.ts adds page-issue detection),
                     only for checks that require a real browser
public/              Static assets (favicon, manifest, robots.txt, _headers, etc.)
```

## Key Behaviors

- **CV PDF**: Generated fresh on every build (`prebuild` script) from
  `src/content/cv-content.ts` via `src/generate-pdf.tsx`, output to
  `public/CV_Johannes-Rackles.pdf`. This file is gitignored — never commit it.
- **CSP/security headers**: `src/routes/plugin@csp.ts` sets a strict CSP
  (nonce-based script-src), X-Frame-Options, COOP/CORP, etc. Disabled in dev
  mode (`isDev`). The site is intentionally same-origin only (no CORS headers).
- **Caching**: `layout.tsx` sets `stale-while-revalidate` (1 week) + `max-age`
  5s cache-control for all pages.
- **Origin/env**: `.env.example` documents `ORIGIN` env var, needed only for
  the Node preview server (`npm run preview`), not for Cloudflare production
  (platform provides absolute request URLs there). Copy to `.env` locally.

## Common Commands

```bash
npm start            # dev server (SSR mode, opens browser)
npm run dev           # dev server (no auto-open)
npm run build         # full production build (prebuild → PDF, client, server)
npm run build.client  # client-only build
npm run build.server  # Cloudflare Pages SSR build
npm run preview       # build client+preview entry, serve locally
npm run serve         # wrangler pages dev ./dist (closest to real CF Pages)
npm run deploy        # wrangler pages deploy ./dist
npm run lint          # biome lint
npm run build.types   # tsc --noEmit type check
npm test              # test.unit + test.integration
npm run test.unit     # vitest unit tests (no build required)
npm run test.integration  # build + vitest tests against a preview server
npm run test.e2e      # build.client + build.preview + playwright test
```

## Testing Notes

- Prefer Vitest over Playwright unless a test genuinely needs a real browser
  (DOM rendering/hydration, console or CSP-violation tracking). Plain HTTP
  checks (content, status codes, response headers) belong in
  `test/integration/`, not in Playwright — it's much slower to spin up.
- `test/unit/`: pure Vitest unit tests, no build or server needed. Includes a
  regression test ensuring the offline "Hackernews clone" demo project is
  listed as plain text, not a dead link — keep in mind if editing that list.
- `test/integration/`: Vitest tests that spin up a Vite preview server (via
  the `preview()` API) against the built site and hit it with plain `fetch`.
  Covers `/`, `/imprint/`, the CV PDF signature, 404 routing, and the
  CSP/security headers from `plugin@csp.ts`. Requires a prior build (`npm run
  test.integration` builds first automatically).
- `e2e/`: Playwright tests against the preview build, reserved for checks
  that need an actual browser. `fixtures.ts` extends tests with `pageIssues`
  tracking (console errors, page errors, failed requests, CSP violations) and
  `expectNoPageIssues`.

## Conventions

- Path alias `~/*` → `./src/*` (configured in `tsconfig.json` and via
  `vite-tsconfig-paths`).
- Strict TypeScript, `noEmit` (Vite/Qwik handles emit); `npm run build.types`
  for standalone type-checking.
- Biome is the single tool for linting AND formatting (2-space indent, LF,
  80 col width) — do not add ESLint/Prettier config for JS/TS.
- Pre-commit hook (Lefthook) auto-fixes staged files with Biome — don't fight
  it, just re-stage if it reformats.
- Generated/build directories (`dist/`, `server/`, `tmp/`, `test-results/`)
  are checked into the working tree by build tools but are gitignored —
  don't hand-edit them.

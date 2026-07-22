# Builders Magazine

Digital platform for **Builders Magazine** — a print magazine dedicated to custom motorcycle
culture. This repo is the Next.js frontend plus its Sanity CMS Studio.

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4 — deployed on Vercel.
- **CMS:** Sanity (headless), with a separate Studio app in [`studio/`](studio/).
- **Content model / data flow:** see [`ARCHITECTURE.md`](ARCHITECTURE.md).
- **Product background / roadmap:** see [`docs/`](docs/).

This document covers running the project locally and deploying it to production. For how the
codebase is actually built (layers, conventions, data flow), read `ARCHITECTURE.md` — this file
stays focused on setup and deployment.

---

## Project structure

```text
app/                  Next.js App Router routes (see ARCHITECTURE.md §1 for the full breakdown)
components/            UI components (ui/, layout/, editorial/, layout-blocks/)
cms/                    Sanity integration — services/ is the only layer app code may import from
types/content.ts       The stable app-wide content contract
lib/, utils/, hooks/    Small app-level helpers
styles/                 Design tokens + global CSS
public/                 Static assets served as-is
studio/                 Sanity Studio — a separate app, own package.json/node_modules (see below)
docs/                   Product/planning documentation
```

---

## Prerequisites

- Node.js `>=20.9.0` (pinned in `package.json`'s `engines` field — matches Next.js 16's own
  requirement)
- npm (this repo uses `package-lock.json`, not another package manager)
- A Sanity project (see [Sanity setup](#sanity-setup) below) — the app runs on mock data without
  one, so this isn't required just to explore the frontend locally

---

## Local development

```bash
# 1. Install the frontend's dependencies
npm install

# 2. Copy the env template and fill in what you have (see "Environment variables" below —
#    every value is optional locally; the app falls back to mock data/localhost defaults)
cp .env.local.example .env.local

# 3. Run the dev server
npm run dev
```

The site is now at `http://localhost:3000`. Without any Sanity env vars set, every page renders
from `cms/services/mock-data.ts` — a complete fixture set covering every content type, so the
whole site is explorable with zero CMS setup.

### Running Sanity Studio locally

The Studio is a separate app in `studio/`, with its own dependencies — it is never a dependency
of the Next.js build (see `ARCHITECTURE.md` for why).

```bash
cd studio && npm install    # first time only

# from the repo root:
npm run dev:studio          # starts Studio, usually at http://localhost:3333
```

### Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build (Turbopack) |
| `npm run start` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` / `format:check` | Prettier |
| `npm run analyze` | Production build with a bundle-size report (webpack, one-off) |
| `npm run dev:studio` / `build:studio` | Thin wrappers around the Studio's own scripts |

---

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values you have. All of them are
optional for local development — see each row for what happens when it's unset.

| Variable | Required in production? | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes, to serve real content | Presence of this is what flips the app from mock data to live Sanity queries (`cms/sanity/client.ts`'s `isSanityConfigured`). Not secret — it identifies a dataset, not a credential. |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes, alongside the above | Defaults to `"production"` if unset but the project ID is set. |
| `SANITY_API_TOKEN` | Yes, for draft preview | Used for the draft-mode/Presentation-preview client (`sanityPreviewClient`). **Needs a token that can read drafts** — a plain read-only "Viewer" token that only sees published content is not enough (Draft Mode would silently show stale/published-only content). See [Sanity setup](#sanity-setup). |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical origin used for canonical URLs, Open Graph/Twitter metadata, and the sitemap. **Must be set in Vercel *before* the build runs** — `NEXT_PUBLIC_` vars are inlined at build time, not read at runtime. Falls back to `http://localhost:3000` locally. |
| `SANITY_PREVIEW_SECRET` | Yes, for draft preview | Checked by `/api/draft-mode/enable`. Must exactly match `SANITY_STUDIO_PREVIEW_SECRET` in the Studio's own env (`studio/.env.local` locally; the Studio's hosting env in production). Generate with `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`. |
| `SANITY_STUDIO_URL` | Recommended | The Studio's own origin, used to stega-encode draft content for the Studio's click-to-edit overlay. Falls back to `http://localhost:3333` if unset — fine locally, but should point at wherever the Studio actually ends up hosted in production (see below). |

`.env.local` is gitignored and never committed. `.env.local.example` is the checked-in template —
keep it in sync if you add a new variable.

---

## Sanity setup

The Studio (`studio/`) and the frontend are two separate apps talking to the same Sanity project.
The Studio's project ID/dataset are hardcoded in `studio/sanity.config.ts` / `studio/sanity.cli.ts`
(no env vars needed there); the frontend reads them from `.env.local` / Vercel env vars as above.

### Token permissions

`SANITY_API_TOKEN` backs **two** different things in this app (`cms/sanity/client.ts`):

1. The public, CDN-cached client (no token needed — it only ever reads published content).
2. The draft-mode preview client (`sanityPreviewClient`), used whenever an editor previews
   unpublished content via Studio's Presentation tool. This one needs the token.

Create the token in your Sanity project (`manage.sanity.io` → API → Tokens) with at least
**Viewer** permissions (read access, including drafts) — a token scoped to published-content-only
will make Draft Mode either show stale content or fail outright. If this app is ever extended to
write to Sanity from server code (it currently never does — see `ARCHITECTURE.md`), that would
need a separate, more privileged token; don't broaden this one further than it needs to be.

### CORS

If the Studio ends up hosted somewhere other than `localhost` (see below), that origin needs to be
added to the Sanity project's allowed CORS origins, or the Studio's own API calls will fail in the
browser:

```bash
npx sanity cors add https://your-studio-domain.example --credentials
```

(Run from inside `studio/`, or pass `--project`/`--dataset` explicitly.) Do this via
`manage.sanity.io` → API → CORS Origins instead if you'd rather use the dashboard.

### Deploying the Studio

The Studio has never been deployed as of this writing (`studio/sanity.cli.ts` has no
`studioHost` set) — content is currently managed by running it locally against the shared
`production` dataset. Two ways to give editors a real, always-on URL:

- **Sanity-hosted** (simplest): from `studio/`, run `npx sanity deploy` — it'll prompt for a
  `studioHost` (giving you `https://<studioHost>.sanity.studio`) and handle the build/upload
  itself. Set `SANITY_STUDIO_URL` in the frontend's Vercel env to that URL afterward.
- **Self-hosted on Vercel**: `npm run build:studio` produces a static `studio/dist` — this can be
  deployed as its own separate Vercel project (root directory `studio`, build command
  `npm run build`, output directory `dist`). Point `SANITY_STUDIO_URL` at whatever domain Vercel
  assigns it.

Either way, remember to add the resulting origin to CORS (above) and set `SANITY_STUDIO_URL` /
`SANITY_STUDIO_PREVIEW_URL` on the two respective sides.

---

## Deploying the frontend to Vercel

This is a standard Next.js App Router project — Vercel's zero-config detection handles the build
with no `vercel.json` needed. `studio/` is gitignored down to its `node_modules`/`dist`/`.sanity`
build artifacts and is never referenced by the root build, so it can't affect it either way.

1. **Import the repo** into Vercel (GitHub integration — new project → select this repo). Leave
   the root directory as `.` (the repo root, not `studio/`).
2. **Set environment variables** (Project Settings → Environment Variables) — all six from the
   table above, for both **Production** and **Preview** environments. Use the real production
   dataset's values for Production; consider a separate Sanity dataset for Preview if you want
   preview deployments to not reflect live content changes immediately (optional — this project
   currently uses a single `production` dataset for both).
3. **Set `NEXT_PUBLIC_SITE_URL`** to the exact production domain (e.g. `https://buildersmagazine.ru`)
   before the first deploy — it's baked into the build, so changing it later needs a redeploy to
   take effect anywhere metadata is generated.
4. **Deploy.** Vercel runs `npm install && npm run build` and serves the output — no further
   configuration needed.
5. **After the first deploy**, add the production domain to Sanity's CORS origins if you haven't
   already (see above) — this matters for the Studio's own origin, not the frontend, but is easy
   to do at the same time.

### Post-deploy checklist

- [ ] Visit the production URL — confirm real Sanity content renders (not mock data / empty
      states). If you see mock data, `NEXT_PUBLIC_SANITY_PROJECT_ID` wasn't set at build time.
- [ ] Check `/sitemap.xml` and `/robots.txt` resolve and reference the correct production domain.
- [ ] Open a document in the Studio and click **Presentation** → confirm the live preview iframe
      loads the production frontend (not `localhost`) and shows draft edits.
- [ ] Spot-check Open Graph output on one story/issue/product page (e.g. via a social-card
      debugger) to confirm images and metadata resolve to absolute production URLs.
- [ ] Confirm `/dev/components` 404s in production (it's gated on `NODE_ENV === "production"` —
      this should need no action, just verify it).

### Image optimization

`next.config.ts` already allowlists Sanity's image CDN (`cdn.sanity.io`) for `next/image` and
prefers AVIF → WebP. No further image config is needed for Sanity-hosted images or the static
placeholders in `public/`. Note that Vercel's own plan limits how many image optimizations are
included before additional usage is billed — worth knowing before a traffic spike, not something
this repo's config can change.

### Security headers

`next.config.ts` sets baseline security headers (`X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`) on every route. There is deliberately no
Content-Security-Policy yet — this site embeds third-party content (YouTube/Vimeo via
`components/ui/Embed.tsx`, Sanity's visual-editing overlay in draft mode) that a CSP would need to
be tested against before shipping; adding one is a good next hardening step but needs that
verification first.

---

## Known gaps to be aware of

- **No static fallback favicon.** The site's favicon comes entirely from Sanity Site Settings
  (`defaultSEO.favicon`, see `app/layout.tsx`) — if that field is ever left empty, the production
  site has no favicon at all. Populate it in Site Settings, or add a static `app/icon.tsx` /
  `app/favicon.ico` as a fallback once real brand assets exist.
- **Single Sanity dataset.** Production and Preview deployments currently point at the same
  `production` dataset — there's no staging/draft dataset separation. Fine for a small editorial
  team, worth revisiting if concurrent unreviewed edits become a problem.

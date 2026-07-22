# Sanity Setup

This document describes the Sanity Studio in `/studio` and how the Next.js app connects to it.
It's implementation documentation (how the current setup works), not product planning — see
`ARCHITECTURE.md` at the repo root for the broader data-layer architecture this fits into.

---

## Project

This app is connected to an existing Sanity project:

- **Project ID:** `l1slax0i`
- **Dataset:** `production`

Both are hardcoded in `studio/sanity.config.ts` and `studio/sanity.cli.ts` (Studio side), and read
from environment variables in the Next.js app (`cms/sanity/client.ts`).

---

## Running the Studio

The Studio is a separate application living in `/studio`, with its own `package.json` and
`node_modules` — it is **not** a dependency of the root Next.js app. This is deliberate: Sanity
Studio pulls in a large dependency tree (~900 packages) that has nothing to do with the deployed
site, so keeping it isolated means it can never affect the Next.js build or bundle size.

```bash
# first time only
cd studio && npm install

# from the repo root
npm run dev:studio     # starts the Studio locally (usually http://localhost:3333)
npm run build:studio   # builds the Studio into studio/dist
```

These root-level scripts are thin wrappers (`npm --prefix studio run dev` / `run build`) — they
exist so you don't have to `cd studio` manually, not because of any workspace/monorepo tooling.

As of this writing the Studio hasn't been deployed anywhere (no `sanity deploy`, no hosted Studio
URL) — content is managed by running it locally against the `production` dataset. See the root
`README.md`'s "Deploying the Studio" section for how to give editors a real hosted URL when
that's needed.

---

## Environment Variables

Two different sides of this integration need env vars, and they use **different variable names**
on purpose — the Studio takes its project ID/dataset directly from `studio/sanity.config.ts` /
`studio/sanity.cli.ts` (hardcoded, no env vars needed for the Studio itself), while the **Next.js
app** reads them from `.env.local`:

```bash
# .env.local (copy from .env.local.example)
NEXT_PUBLIC_SANITY_PROJECT_ID=l1slax0i
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
NEXT_PUBLIC_SITE_URL=
SANITY_PREVIEW_SECRET=
SANITY_STUDIO_URL=
```

See the root `README.md`'s "Environment variables" table for what each of these does and whether
it's required in production — this section only covers the two specific to this doc's scope:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` — presence of the project ID is
  what flips the app from mock data to real Sanity queries (see "Fallback" below). Both are
  `NEXT_PUBLIC_` because they're not secret — they identify a dataset that's readable via Sanity's
  CDN, not a credential.
- `SANITY_API_TOKEN` — not required for reading published content (the public client fetches with
  `useCdn: true`, which only serves published documents and needs no auth). It **is** required for
  Draft Mode / Presentation preview (see below) — that path needs a token with drafts-read access,
  not just a plain published-content reader.

`.env.local` is gitignored and never committed — `.env.local.example` is the checked-in template.

---

## Creating Content

1. Run `npm run dev:studio` and open the Studio in your browser.
2. Nine document types are available, matching `types/content.ts` exactly: **Media Asset**,
   **Person**, **Issue**, **Story**, **Bike**, **Builder**, **Builders Cup**, **Product**, and
   **Site Settings**.
3. **Site Settings is a singleton** — the app fetches it by a fixed document ID (`siteSettings`),
   not by querying the `siteSettings` type. When creating this document in the Studio, its ID
   needs to be exactly `siteSettings` for the app to find it (the Studio doesn't currently enforce
   this — no desk-structure customization was added to restrict it to one document, so it's a
   manual convention for now). If no document with that ID exists yet, the app falls back to mock
   Site Settings data automatically rather than showing a broken page.
4. Upload images through **Media Asset** documents first, then reference them from other
   documents' image fields (Issue's cover, Story's cover/gallery, Product's main image, etc.) —
   images are modeled as their own reusable document type with caption/credit/alt text, not
   inlined per-entity.
5. Relationships (Story → Builder, Bike → Builder, Builders Cup → participants, etc.) are plain
   Sanity references — pick the related document from the reference field's picker.
6. Content becomes visible to *anonymous site visitors* once published in the Studio (the public
   client reads via the CDN, which only serves published documents). Editors previewing unpublished
   work don't have to wait for that: opening a document and clicking **Presentation** in the Studio
   renders it live against the real frontend via Next.js Draft Mode — see `app/api/draft-mode/`,
   `cms/sanity/client.ts`'s `sanityPreviewClient`, and `studio/lib/previewUrl.ts` for how the two
   sides stay in sync on which frontend route a given document maps to.

---

## How the Mock → Sanity Fallback Works

Every function in `cms/services/*.ts` checks `isSanityConfigured` (from `cms/sanity/client.ts`,
`true` when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set) before deciding where to get its data:

```ts
export async function getAllIssues(): Promise<Issue[]> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawIssue[]>(ALL_ISSUES_QUERY);
    return raw.map(mapIssue);
  }
  return [...mockIssues].sort(byReleaseDateDesc);
}
```

With `.env.local` pointing at this project (as set up above), every page now queries real Sanity
data instead of `cms/services/mock-data.ts`'s fixtures. **If the dataset has few or no documents
of a given type yet, pages will show correspondingly empty states** — an empty Issues grid, no
generated `/magazine/[slug]` detail pages, and so on. This is expected, not a bug: it's the same
code path a fully populated dataset would use, just with less content in it. Populate the Studio
(see "Creating Content" above) to see pages fill in.

To go back to mock data at any time (e.g. for UI development without touching real content), unset
`NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local` (or delete the file) and restart the dev server —
no code changes are needed either way. See `ARCHITECTURE.md` §2–3 for the full service-layer and
Sanity-client design this relies on.

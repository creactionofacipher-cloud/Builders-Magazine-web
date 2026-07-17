# Architecture

This document describes how the codebase is actually built — as opposed to `docs/`, which
describes what the project is supposed to become. If the two disagree, `docs/` is the source of
truth for product intent, and this file should be updated to match the code.

---

## 1. Project Structure

```
app/                  Next.js App Router routes
  layout.tsx           Root layout — <html>/<body>, root generateMetadata, no-FOUC theme script
  page.tsx              "/" — redirects to "/ru" (see i18n below)
  [locale]/              Locale-scoped routes (the entire public site lives here)
    layout.tsx            Validates the locale, renders Header/Footer, fetches Site Settings once
    page.tsx               Homepage
    magazine/, stories/, builders-cup/, buy/, about/, search/
  dev/components/        Internal component catalog (blocked in production), self-contained fixtures

components/
  ui/                   Primitives: Button, Heading, Text, Image, RichText, SearchInput, ...
                         No entity knowledge, no data fetching. Pure presentation + design tokens.
  layout/                Structural/chrome: Container, Section, Grid, Header, Footer, Navigation
  editorial/              Entity-aware, composed from ui/ + layout/: IssueCard, StoryCard,
                         Hero, FeaturedIssue, ProductCard, ...

cms/
  services/              THE public API. Every page imports only from here (see §2, §6).
  sanity/                Sanity client + config detection (see §3)
  schemas/                Sanity schema definitions, one file per document type (see §4)
  queries/                GROQ query strings, one file per entity + shared fragments.ts
  mappers/                Raw Sanity response → types/content.ts shape (see §4)

types/content.ts       The stable contract. Every entity's TypeScript shape. UI, mock data, and
                        mapped Sanity data all produce exactly this shape — this is what makes the
                        data source swappable without touching UI.

lib/
  i18n/locales.ts        SUPPORTED_LOCALES / ENABLED_LOCALES (see §5)
  navigation.ts           Primary nav config
  site.ts                  SITE_URL (deployment config — not content, see §3)

utils/                 Small pure functions (cn, portableTextToPlainText, isStoryCategory)
styles/                 tokens.css (design tokens, light/dark theme), globals.css
hooks/                  Reserved, currently empty — no custom hook has been needed yet

docs/                   Product/planning documentation (project owner's source of truth — do not
                        edit speculatively; see docs/07_TASKS.md for the milestone history)
content/, assets/       Reserved for future use, currently empty
```

---

## 2. Service Layer Principles

Every page gets its data by calling a function in `cms/services/*.ts` — never anything else.
Each entity (Issue, Story, Bike, Builder, Builders Cup, Person, Product, Site Settings) has one
service file exporting plain `async` functions with a stable signature, e.g.:

```ts
// cms/services/issues.ts
export async function getAllIssues(): Promise<Issue[]>;
export async function getIssueBySlug(slug: string): Promise<Issue | null>;
export async function getCurrentIssue(): Promise<Issue | null>;
```

Two properties make this layer worth having:

- **The signature never changes**, regardless of where the data actually comes from. A page
  calling `getIssueBySlug("foo")` doesn't know or care whether that resolved to a Sanity query or
  a mock array lookup.
- **Composition happens at this layer, not in pages.** `getCurrentIssue()` just calls
  `getAllIssues()` and takes the first result; `cms/services/search.ts` composes over
  `getStories()`/`getAllIssues()`/`getAllBikes()`/`getAllBuilders()` and has zero knowledge of
  Sanity itself. Business logic like "what counts as related" or "how is search matched" lives
  here, not in `app/`.

Internally, most service functions look like this:

```ts
export async function getAllIssues(): Promise<Issue[]> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawIssue[]>(ALL_ISSUES_QUERY);
    return raw.map(mapIssue);
  }
  return [...mockIssues].sort(byReleaseDateDesc);
}
```

`mock-data.ts` (inside `cms/services/`) holds the fixture data for every entity. It is treated as
private to the service layer — nothing outside `cms/services/*.ts` may import it (enforced by
ESLint, see §6). `Site Settings` is the one singleton (not a collection) and additionally wraps
its function in React's `cache()` so the same request-scoped fetch is shared between
`generateMetadata()` and a page body without a real duplicate fetch.

---

## 3. How Sanity Connects

`cms/sanity/client.ts` is the only place that talks to the Sanity SDK:

```ts
export const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
export const sanityClient: SanityClient | null = isSanityConfigured ? createClient({...}) : null;
export async function sanityFetch<T>(query: string, params = {}): Promise<T>
```

**Graceful fallback, not a hard dependency.** `isSanityConfigured` is checked by every service
function. When it's `false` (no `NEXT_PUBLIC_SANITY_PROJECT_ID` set — the default state of a
fresh checkout with no `.env.local`), every service silently serves mock data instead, and the
site is fully functional. This was a deliberate choice made because provisioning a real Sanity
project isn't something that can happen automatically — the moment real credentials are added to
`.env.local` (see `.env.local.example`), every service switches to live data with **zero further
code changes**.

**Images.** Sanity's image CDN accepts sizing/format params directly on the asset URL, so
`cms/sanity/image.ts` just appends `?w=2400&fit=max&auto=format` to cap the source resolution
before handing it to `next/image` (which does its own responsive resizing from there) — no
`@sanity/image-url` SDK dependency needed for that.

**Config detection is one flag.** `SANITY_API_VERSION` is pinned (`2025-01-01`) per Sanity's own
recommended practice — breaking API changes are gated behind that date, not silently applied.

**No embedded Studio.** This repo does not run a Sanity Studio instance. `cms/schemas/*.ts` are
plain typed objects (see §4) meant to be used by a real `sanity.config.ts` in a separate Studio
project (or an embedded one added later) — `defineType`/`defineField` from the `sanity` package
are identity functions at runtime, so these files are already 100% compatible with a real Studio
without that (large) package being a dependency here.

---

## 4. How to Add a New Entity

This is the exact recipe every entity in this codebase followed (Issue, Story, Bike, Builder,
Builders Cup, Person, Product, Site Settings):

1. **`types/content.ts`** — add the interface. This is the contract; get the field shape right
   here first, matching `docs/03_CONTENT_MODEL.md` if the entity is documented there.
2. **`cms/schemas/<entity>.ts`** — a plain object (`{ name, title, type: "document", fields: [...] }`)
   using the local `SchemaTypeDefinition` type in `cms/schemas/types.ts`. Field names should match
   the app type exactly. Register it in `cms/schemas/index.ts`'s `schemaTypes` array.
3. **`cms/queries/<entity>.ts`** — GROQ query strings. Reuse projections from
   `cms/queries/fragments.ts` for anything that dereferences a `mediaAsset`, `person`, `bike`, or
   `builder` reference, rather than re-writing the dereference logic per query. Watch required
   fields: a projection that can stand in for an entity (nested or top-level) must include every
   field that's non-optional on that entity's TypeScript interface, or the mapper's return type
   won't check out.
4. **`cms/mappers/<entity>.ts`** — converts the raw GROQ response to the exact app type. Most
   mappers are near-identity (the GROQ projection already aliases fields correctly); the real
   transform work happens where Sanity has no equivalent of a feature the app type needs — e.g.
   `Bike.specifications` is `Record<string, string>` in the app, but GROQ returns an array of
   `{key, value}` pairs (Sanity has no dynamic-key object field), so the mapper does that
   conversion. Keep this function even when it's currently a pass-through — it's the designated
   place a future GROQ shape change gets absorbed without touching services or UI.
5. **`cms/services/<entity>.ts`** — the dual-path functions described in §2. Preserve whatever the
   mock branch already does exactly (don't refactor it while adding the Sanity branch) if this is
   an existing entity gaining Sanity support — the two most common ways to accidentally regress
   the UI are (a) changing mock curation order/logic and (b) fetching a field in the Sanity path
   that the mock path never populated for that field's default state.
6. **`cms/services/mock-data.ts`** — add the fixture array/object. This file is what makes every
   milestone testable and demoable before a real Sanity project exists.
7. **Nothing in `app/` or `components/` changes** unless the entity is genuinely new UI surface
   (a new page). Adding Sanity support to an _existing_ entity should never require touching a
   page or component — if it does, something reached around the service layer.

---

## 5. Internationalization (i18n)

All public routes live under `app/[locale]/...`. Locale handling is deliberately minimal — no
i18n library, just a small config and a route segment:

```ts
// lib/i18n/locales.ts
export const SUPPORTED_LOCALES = ["ru", "en"] as const; // the eventual target
export const ENABLED_LOCALES = ["ru"] as const; // what actually builds/routes today
export const DEFAULT_LOCALE: EnabledLocale = "ru";
```

- `app/page.tsx` (outside the `[locale]` segment) does a plain `redirect('/ru')` — the only job
  of the bare `/` route.
- `app/[locale]/layout.tsx` calls `generateStaticParams()` returning `ENABLED_LOCALES`, and sets
  `export const dynamicParams = false` — so `/en/...` isn't generated and 404s instead of being
  rendered on demand, even though `"en"` is a recognized, "supported" locale.
- Content (mock data, UI copy) is authored directly in Russian. There is no translation layer —
  enabling English later means adding `"en"` to `ENABLED_LOCALES`, translating the content, and
  nothing else about the routing structure changes.

**To enable a new locale:** add it to `ENABLED_LOCALES`, ensure `cms/services/*.ts` (or the CMS
content itself) can serve that language, and translate the hardcoded UI copy that isn't
data-driven (nav labels in `lib/navigation.ts`, a handful of page-level strings). No route
restructuring is needed — this was the entire point of routing through `[locale]` from the start.

---

## 6. Development Rules

These are enforced mechanically (ESLint), not just by convention — violating them fails `npm run lint`.

- **UI never talks to Sanity directly.** `app/`, `components/`, and `hooks/` may only import from
  `cms/services`. Importing `cms/queries`, `cms/mappers`, `cms/schemas`, `cms/sanity`, or
  `@sanity/client` from any of those is a lint error (`no-restricted-imports` in
  `eslint.config.mjs`). This is the single most important rule in the codebase — it's what makes
  the mock/Sanity fallback possible at all, and what will make a future search-engine swap
  (`04_TECH_STACK.md`'s stated requirement) or a CMS migration possible without touching UI.
- **`mock-data.ts` is private to `cms/services/`.** Nothing else — not `cms/queries`, not
  `cms/mappers`, not `cms/schemas`, not UI — may import it directly. Also enforced by ESLint.
- **No GROQ strings outside `cms/queries/`.** A page should never contain a query string, even an
  inline one for "just this once."
- **Components consume typed models only** (`types/content.ts`), never raw Sanity documents or
  `any`.
- **Server Components by default.** A component only becomes `"use client"` when it genuinely
  needs interactivity (state, browser APIs, event handlers). Today that's `MobileNav`,
  `StoryCategoryNav`, `Filter`, `SearchInput`, `ThemeToggle`, `app/dev/components/FilterDemo.tsx`,
  and `app/[locale]/error.tsx` (a Next.js requirement — error boundaries must be client
  components) — everything else is a Server Component.
- **No hardcoded colors, spacing, or timing values in component code.** Everything comes from
  `styles/tokens.css`. The one intentional exception is the `tone="inverted"` family
  (`Heading`/`Text`/`Button`) — hardcoded white/black on purpose, because it must stay legible on
  a photo overlay regardless of which theme (light/dark) the page is in.
- **Reuse before creating.** A new card/component is only justified when nothing existing fits the
  shape — check `components/ui/` and `components/editorial/` first. Several entities intentionally
  render as non-`Link` `<article>`s (`BikeCard`, `BuilderCard`, `ProductCard` before its detail
  page shipped) because their detail routes didn't exist yet — don't wire up a link to a route
  that returns 404.
- **Mock data must mirror what Sanity would actually return**, including fields no current page
  renders yet — this is what keeps "swap mock for Sanity" a data-source change instead of a
  data-shape change.

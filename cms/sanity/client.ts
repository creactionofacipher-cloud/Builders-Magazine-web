import { createClient, type FilterDefault, type SanityClient } from "@sanity/client";
import { draftMode } from "next/headers";

// Pinned API version, per Sanity's recommended practice (breaking API
// changes are gated behind the date, not silently applied).
const SANITY_API_VERSION = "2025-01-01";

// ISR window for published-content fetches — how long a statically
// generated page can serve stale content before Next.js re-fetches and
// regenerates it in the background. Only applies to the public client
// (see sanityFetch below); draft/preview fetches always read fresh.
const REVALIDATE_SECONDS = 300;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
const studioUrl = process.env.SANITY_STUDIO_URL || "http://localhost:3333";

// Stega encodes invisible metadata into a *string value itself* so
// @sanity/visual-editing can map a rendered DOM text node back to its
// source document/field (that's what the Presentation tool's "Edit"
// toggle overlays use). It must never land on a value that gets used as
// a URL, href, or attribute rather than rendered as visible text — an
// embedded invisible character there silently breaks it (a stega-encoded
// image `url` 404s, a stega-encoded `href` dead-links). Sanity's own
// `filterDefault` heuristic already catches most of this, but this app's
// own field names (MediaAsset.url, MediaAsset.altText, every `slug`,
// `externalBuyUrl`, social `email`) are cheap and unambiguous to also
// exclude explicitly rather than trust the heuristic alone.
const STEGA_UNSAFE_FIELD_NAME_FRAGMENTS = ["url", "href", "slug", "alttext", "email"];

function stegaFilter(props: Parameters<FilterDefault>[0]): boolean {
  const fieldName = String(props.resultPath.at(-1) ?? "").toLowerCase();
  if (STEGA_UNSAFE_FIELD_NAME_FRAGMENTS.some((unsafe) => fieldName.includes(unsafe))) {
    return false;
  }
  return props.filterDefault(props);
}

// True once a real Sanity project is configured (see .env.local.example).
// Every cms/services/*.ts function checks this before querying — when
// false, they fall back to the existing mock data so the site keeps
// working with no project provisioned yet. Flip this on by setting
// NEXT_PUBLIC_SANITY_PROJECT_ID; no other code changes needed anywhere.
export const isSanityConfigured = Boolean(projectId);

// The public site's client — CDN-cached, published content only, no
// token. Every visitor gets this; nothing about draft preview changes
// this client or its behavior.
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: SANITY_API_VERSION,
      useCdn: true,
    })
  : null;

// Only used when Next.js Draft Mode is on (see app/api/draft-mode/enable) —
// bypasses the CDN and reads the "drafts" perspective, which overlays
// unpublished edits on top of published content. Requires a token with
// read access (drafts aren't visible to anonymous/CDN reads); if the
// token isn't set, sanityFetch below just falls back to the public
// client and previews show published content only, rather than throwing.
// Exported (not just used internally by resolveClient below) because
// app/api/draft-mode/enable also needs a client to hand to
// @sanity/preview-url-secret's validatePreviewUrl() — that's SDK
// plumbing for the preview-secret handshake itself, not a content query,
// so it's exempted from the cms/sanity UI-boundary rule (see
// eslint.config.mjs). Only this client stega-encodes — the public
// sanityClient above never does, so the production site's HTML never
// carries any of this invisible metadata regardless of draft mode logic
// elsewhere being correct.
export const sanityPreviewClient: SanityClient | null =
  isSanityConfigured && token
    ? createClient({
        projectId,
        dataset,
        apiVersion: SANITY_API_VERSION,
        useCdn: false,
        token,
        perspective: "drafts",
        stega: { enabled: true, studioUrl, filter: stegaFilter },
      })
    : null;

// Thin wrapper so callers don't each have to null-check sanityClient —
// only ever called from behind an isSanityConfigured guard, but this
// keeps that guarantee in one place instead of repeated at every call
// site. Also the single place that decides published vs. draft content:
// every cms/services/*.ts function calls this exact same function either
// way, so draft preview needed zero changes to any service, query,
// mapper, or page — only this file and the draft-mode routes/actions.
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const client = await resolveClient();
  if (!client) {
    throw new Error("sanityFetch called without a configured Sanity client");
  }
  // ISR only applies to the public (published, CDN) client — draft mode
  // must always read fresh, never serve a cached response from before the
  // edit currently being previewed.
  const options = client === sanityPreviewClient ? undefined : { next: { revalidate: REVALIDATE_SECONDS } };
  return client.fetch<T>(query, params, options);
}

async function resolveClient(): Promise<SanityClient | null> {
  if (!sanityPreviewClient) return sanityClient;
  try {
    const { isEnabled } = await draftMode();
    return isEnabled ? sanityPreviewClient : sanityClient;
  } catch {
    // draftMode() throws outside a real request scope — notably inside
    // generateStaticParams, which runs at build time before any request
    // exists (see the [slug] pages' own generateStaticParams). That
    // context can only ever want published content for the static param
    // list anyway, so falling back to the public client here is the
    // correct behavior, not just a defensive catch-all.
    return sanityClient;
  }
}

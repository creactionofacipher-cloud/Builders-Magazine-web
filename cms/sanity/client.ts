import { createClient, type SanityClient } from "@sanity/client";

// Pinned API version, per Sanity's recommended practice (breaking API
// changes are gated behind the date, not silently applied).
const SANITY_API_VERSION = "2025-01-01";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// True once a real Sanity project is configured (see .env.local.example).
// Every cms/services/*.ts function checks this before querying — when
// false, they fall back to the existing mock data so the site keeps
// working with no project provisioned yet. Flip this on by setting
// NEXT_PUBLIC_SANITY_PROJECT_ID; no other code changes needed anywhere.
export const isSanityConfigured = Boolean(projectId);

export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: SANITY_API_VERSION,
      useCdn: true,
    })
  : null;

// Thin wrapper so callers don't each have to null-check sanityClient —
// only ever called from behind an isSanityConfigured guard, but this
// keeps that guarantee in one place instead of repeated at every call site.
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  if (!sanityClient) {
    throw new Error("sanityFetch called without a configured Sanity client");
  }
  return sanityClient.fetch<T>(query, params);
}

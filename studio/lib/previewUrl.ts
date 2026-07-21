// Single source of truth for "given this document, what's its real
// frontend URL" — used by both the Presentation tool's previewUrl
// resolver (sanity.config.ts) and the per-document "Open Preview" action
// (studio/lib/openPreviewAction.tsx), so the two can never drift apart
// the way two hand-maintained copies of this mapping would.
export const PREVIEWABLE_TYPES = ["story", "issue", "buildersCup", "product"] as const;
export type PreviewableType = (typeof PREVIEWABLE_TYPES)[number];

export function isPreviewableType(type: string): type is PreviewableType {
  return (PREVIEWABLE_TYPES as readonly string[]).includes(type);
}

// Mirrors the real route each document type resolves to on the frontend
// (app/[locale]/stories/[slug], app/[locale]/magazine/[slug],
// app/[locale]/builders-cup/[slug], app/[locale]/buy/merchandise/[slug]) —
// "ru" is the only enabled locale (see lib/i18n/locales.ts in the main app).
const FRONTEND_PATH_PREFIX: Record<PreviewableType, string> = {
  story: "/ru/stories",
  issue: "/ru/magazine",
  buildersCup: "/ru/builders-cup",
  product: "/ru/buy/merchandise",
};

export function resolvePreviewPath(type: PreviewableType, slug: string): string {
  return `${FRONTEND_PATH_PREFIX[type]}/${slug}`;
}

// Must be SANITY_STUDIO_-prefixed to be exposed to the Studio's Vite
// bundle. Falls back to the local Next.js dev server so `sanity dev`
// previews work out of the box with no extra setup — set
// SANITY_STUDIO_PREVIEW_URL in studio/.env.local to point at a deployed
// frontend instead (see studio/.env.local.example).
export function getFrontendOrigin(): string {
  return process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";
}

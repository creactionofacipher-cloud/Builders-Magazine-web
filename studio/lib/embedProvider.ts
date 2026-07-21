// Minimal mirror of utils/embed.ts's URL-based provider detection, for
// the embed block's Studio preview only (studio/components/previews/EmbedPreview.tsx).
// Studio is a separate package from the main app and can't import its
// utils/ directly — same "duplicate small logic across the two schema
// layers" precedent as RICH_TEXT_IMAGE_VARIANTS/EMBED_PROVIDERS in
// studio/schemas/portableTextBlocks.ts. Only detects *which* provider,
// not the embeddable URL — the Studio preview doesn't render the player.
export type DetectedProvider = "youtube" | "vimeo" | "other";

export function detectEmbedProvider(rawUrl: string | undefined): DetectedProvider {
  if (!rawUrl) return "other";
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return "other";
  }
  if (url.hostname.includes("youtube.com") || url.hostname.endsWith("youtu.be")) return "youtube";
  if (url.hostname.includes("vimeo.com")) return "vimeo";
  return "other";
}

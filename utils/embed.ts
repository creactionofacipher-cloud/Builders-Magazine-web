// URL-based provider detection for the Embed rich text block — see
// components/ui/Embed.tsx. Detection runs from the URL alone so an editor
// never has to correctly fill in the schema's optional `provider` field
// for the embed to work (see RichTextEmbed in types/content.ts).

function extractYouTubeId(url: URL): string | null {
  if (url.hostname === "youtu.be" || url.hostname.endsWith(".youtu.be")) {
    return url.pathname.slice(1).split("/")[0] || null;
  }
  if (!url.hostname.includes("youtube.com")) return null;

  if (url.pathname === "/watch") return url.searchParams.get("v");

  const embedMatch = url.pathname.match(/^\/embed\/([^/]+)/);
  if (embedMatch) return embedMatch[1];

  const shortsMatch = url.pathname.match(/^\/shorts\/([^/]+)/);
  if (shortsMatch) return shortsMatch[1];

  return null;
}

function extractVimeoId(url: URL): string | null {
  if (!url.hostname.includes("vimeo.com")) return null;
  const match = url.pathname.match(/\/(\d+)/);
  return match ? match[1] : null;
}

export interface ResolvedEmbed {
  provider: "youtube" | "vimeo";
  embedUrl: string;
}

// Returns null for anything that isn't a recognizable YouTube/Vimeo URL —
// callers render a plain link in that case rather than crashing (also
// covers malformed URLs, which fail the `new URL()` parse below).
export function resolveEmbed(rawUrl: string): ResolvedEmbed | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return { provider: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}` };
  }

  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return { provider: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeoId}` };
  }

  return null;
}

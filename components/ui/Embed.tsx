import { resolveEmbed } from "@/utils/embed";
import { cn } from "@/utils/cn";
import { Link } from "./Link";

interface EmbedProps {
  url: string;
  className?: string;
}

// YouTube/Vimeo render as a responsive 16:9 player. Any other URL (or one
// that fails to parse) renders as a plain external link instead — an
// embed block should never crash the page it's on.
export function Embed({ url, className }: EmbedProps) {
  const resolved = resolveEmbed(url);

  if (!resolved) {
    return (
      <Link href={url} className={className} target="_blank" rel="noopener noreferrer">
        {url}
      </Link>
    );
  }

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden bg-surface", className)}>
      <iframe
        src={resolved.embedUrl}
        title={`${resolved.provider === "youtube" ? "YouTube" : "Vimeo"} video`}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

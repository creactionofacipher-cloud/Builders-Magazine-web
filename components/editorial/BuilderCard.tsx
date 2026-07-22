import type { Builder } from "@/types/content";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { HighlightText } from "@/components/ui/HighlightText";
import { cn } from "@/utils/cn";

interface BuilderCardProps {
  builder: Builder;
  className?: string;
  /** Highlights the matching substring in the name — set when this card
   * renders inside search results. Omitted everywhere else. */
  highlightQuery?: string;
}

// Not a Link: /builders/[slug] is a post-MVP route (docs/10_POST_MVP.md,
// Phase 2). Becomes clickable once that route ships.
export function BuilderCard({ builder, className, highlightQuery }: BuilderCardProps) {
  const cover = builder.projects?.[0]?.images?.[0];

  return (
    <article className={cn("flex flex-col gap-3", className)}>
      {cover && <Image asset={cover} preset="card" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />}
      <div className="flex flex-col gap-1">
        <Heading level={3}>
          <HighlightText text={builder.name} query={highlightQuery} />
        </Heading>
        {builder.location && <Text variant="muted">{builder.location}</Text>}
      </div>
    </article>
  );
}

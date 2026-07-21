import type { Bike } from "@/types/content";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { HighlightText } from "@/components/ui/HighlightText";
import { cn } from "@/utils/cn";

interface BikeCardProps {
  bike: Bike;
  className?: string;
  /** Highlights the matching substring in the name — set when this card
   * renders inside search results. Omitted everywhere else. */
  highlightQuery?: string;
}

// Not a Link: /bikes/[slug] is a post-MVP route (docs/10_POST_MVP.md,
// Phase 2). Becomes clickable once that route ships.
export function BikeCard({ bike, className, highlightQuery }: BikeCardProps) {
  const cover = bike.images?.[0];
  const meta = [bike.brand, bike.year?.toString()].filter(Boolean).join(" · ");

  return (
    <article className={cn("flex flex-col gap-3", className)}>
      {cover && <Image asset={cover} preset="card" sizes="(min-width: 1024px) 33vw, 100vw" />}
      <div className="flex flex-col gap-1">
        {meta && (
          <Text variant="muted" className="text-xs tracking-wide uppercase">
            {meta}
          </Text>
        )}
        <Heading level={4}>
          <HighlightText text={bike.name} query={highlightQuery} />
        </Heading>
        {bike.builder && <Text variant="muted">{bike.builder.name}</Text>}
      </div>
    </article>
  );
}

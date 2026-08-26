import type { Bike } from "@/types/content";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { HighlightText } from "@/components/ui/HighlightText";
import { cn } from "@/utils/cn";

interface BikeCardProps {
  bike: Bike;
  className?: string;
  /** Highlights the matching substring in the name — set when this card
   * renders inside search results. Omitted everywhere else. */
  highlightQuery?: string;
  /** Builders Cup result — omitted everywhere the card isn't a Builders
   * Cup participant. A winner with no resolved nomination (legacy events
   * authored before nominations existed — see cms/queries/buildersCup.ts)
   * renders as a plain card, same as a non-winner: no empty badge. */
  winner?: boolean;
  nomination?: { title: string };
}

// Not a Link: /bikes/[slug] is a post-MVP route (docs/10_POST_MVP.md,
// Phase 2). Becomes clickable once that route ships.
export function BikeCard({ bike, className, highlightQuery, winner, nomination }: BikeCardProps) {
  const cover = bike.images?.[0];
  const meta = [bike.brand, bike.year?.toString()].filter(Boolean).join(" · ");

  return (
    <article className={cn("flex flex-col gap-3", className)}>
      {cover && <Image asset={cover} preset="card" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />}
      <div className="flex flex-col gap-1">
        {meta && (
          <Text variant="muted" className="text-xs tracking-wide uppercase">
            {meta}
          </Text>
        )}
        <Heading level={3}>
          <HighlightText text={bike.name} query={highlightQuery} />
        </Heading>
        {bike.builder && <Text variant="muted">{bike.builder.name}</Text>}
        {winner && nomination?.title && (
          <Badge className="mt-1 w-fit border-success text-success">🏆 {nomination.title}</Badge>
        )}
      </div>
    </article>
  );
}

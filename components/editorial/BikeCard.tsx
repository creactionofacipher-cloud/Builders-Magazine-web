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
  /** Builders Cup result — omitted everywhere the card isn't a Builders
   * Cup participant. A winner whose nomination key no longer matches any
   * entry in the event's nominations (e.g. the nomination was deleted
   * after being awarded) renders as a plain card, same as a non-winner:
   * no empty badge. */
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
          // Not <Badge>: Badge's own text-xs/px-2/text-muted classes would
          // collide with the bigger, two-tone styling this needs — cn()
          // is a non-merging join (see ProductCard's Sold Out label for
          // the same reasoning), so stacking overrides on top of Badge's
          // defaults leaves which one wins to generated CSS order, not
          // intent.
          <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 py-1 font-body text-sm tracking-wide uppercase">
            <span className="font-bold text-foreground">Winner</span>
            <span className="w-px self-stretch bg-border" />
            <span className="font-medium text-muted">{nomination.title}</span>
          </span>
        )}
      </div>
    </article>
  );
}

import type { Story } from "@/types/content";
import type { EnabledLocale } from "@/lib/i18n/locales";
import { Link } from "@/components/ui/Link";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { HighlightText } from "@/components/ui/HighlightText";
import { cn } from "@/utils/cn";

interface StoryCardProps {
  story: Story;
  locale: EnabledLocale;
  className?: string;
  /** Highlights the matching substring in the title — set when this card
   * renders inside search results (see app/[locale]/search/page.tsx).
   * Omitted (default) everywhere else this card is used. */
  highlightQuery?: string;
  /** Overrides the default 3-column-grid `sizes` guess — needed wherever
   * this card doesn't actually render at 33vw, e.g.
   * components/layout-blocks/StoryGridBlock.tsx's "editorial" layout
   * renders the lead card at lg:col-span-2 (~66vw at desktop), not 33vw;
   * requesting the default there under-fetched resolution for the most
   * visually prominent story on the page. */
  sizes?: string;
}

export function StoryCard({
  story,
  locale,
  className,
  highlightQuery,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: StoryCardProps) {
  return (
    <Link
      href={`/${locale}/stories/${story.slug}`}
      variant="plain"
      className={cn("group flex flex-col gap-3", className)}
    >
      <Image
        asset={story.coverImage}
        preset="card"
        sizes={sizes}
        className="transition-opacity duration-[var(--duration-base)] ease-[var(--ease-standard)] group-hover:opacity-90"
      />
      <div className="flex flex-col gap-2">
        <Badge>{story.category}</Badge>
        <Heading level={3}>
          <HighlightText text={story.title} query={highlightQuery} />
        </Heading>
        <Text variant="muted">{story.shortDescription}</Text>
      </div>
    </Link>
  );
}

import type { Person } from "@/types/content";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { HighlightText } from "@/components/ui/HighlightText";
import { cn } from "@/utils/cn";

interface PersonCardProps {
  person: Person;
  className?: string;
  /** Highlights the matching substring in the name — set when this card
   * renders inside search results. Omitted everywhere else. */
  highlightQuery?: string;
}

// Portrait card: photo, name, role. Not a Link — Person has no public
// detail route in MVP (03_CONTENT_MODEL.md lists Person → Social Links
// and Person → Team as future relations, not a page). No existing card
// fits this shape; the other five are all entity-with-cover-and-excerpt.
export function PersonCard({ person, className, highlightQuery }: PersonCardProps) {
  return (
    <article className={cn("flex flex-col gap-3", className)}>
      {person.photo && (
        <Image asset={person.photo} preset="card" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
      )}
      <div className="flex flex-col gap-1">
        {/* `!` overrides level=3's own text-2xl/md:text-3xl — cn() is a
         plain class join (no tailwind-merge dedup), so a same-specificity
         size utility here wouldn't reliably win. Sized down specifically
         because a two-word name (unlike a card's headline/title text)
         should read as one line — at the default level=3 size, a name
         like "Варламов Илья" wrapped to two lines on this card's ~260px
         width, confirmed live (2026-07). */}
        <Heading level={3} className="!text-lg md:!text-xl">
          <HighlightText text={person.name} query={highlightQuery} />
        </Heading>
        <Text variant="muted">{person.role}</Text>
      </div>
    </article>
  );
}

import type { BuildersCup } from "@/types/content";
import type { EnabledLocale } from "@/lib/i18n/locales";
import { Link } from "@/components/ui/Link";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { portableTextToPlainText } from "@/utils/portableTextToPlainText";
import { cn } from "@/utils/cn";

interface BuildersCupCardProps {
  event: BuildersCup;
  locale: EnabledLocale;
  className?: string;
}

// Compact grid card, same pattern as IssueCard/StoryCard. Necessary here
// because BuildersCupHighlight is a single-event spotlight layout (used
// for "latest event"), not a grid card — no existing component fits a
// "previous events" grid.
export function BuildersCupCard({ event, locale, className }: BuildersCupCardProps) {
  const excerpt = portableTextToPlainText(event.description, 140);
  const dateLabel = new Date(event.date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
  });

  return (
    <Link
      href={`/${locale}/builders-cup/${event.slug}`}
      variant="plain"
      className={cn("group flex flex-col gap-3", className)}
    >
      <Image
        asset={event.coverImage}
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="transition-opacity duration-[var(--duration-base)] ease-[var(--ease-standard)] group-hover:opacity-90"
      />
      <div className="flex flex-col gap-1">
        <Text variant="muted" className="text-xs tracking-wide uppercase">
          {dateLabel}
          {event.location ? ` · ${event.location}` : ""}
        </Text>
        <Heading level={4}>{event.name}</Heading>
        {excerpt && <Text variant="muted">{excerpt}</Text>}
      </div>
    </Link>
  );
}

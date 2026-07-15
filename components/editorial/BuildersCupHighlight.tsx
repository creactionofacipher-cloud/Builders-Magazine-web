import type { BuildersCup } from "@/types/content";
import type { EnabledLocale } from "@/lib/i18n/locales";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Link } from "@/components/ui/Link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { portableTextToPlainText } from "@/utils/portableTextToPlainText";
import { cn } from "@/utils/cn";

interface BuildersCupHighlightProps {
  event: BuildersCup;
  locale: EnabledLocale;
  className?: string;
}

// Single-event spotlight, same pattern as FeaturedIssue. Reusable
// wherever one Builders Cup event needs to be featured (homepage now,
// potentially /builders-cup listing later).
export function BuildersCupHighlight({ event, locale, className }: BuildersCupHighlightProps) {
  const excerpt = portableTextToPlainText(event.description, 220);
  const eventHref = `/${locale}/builders-cup/${event.slug}`;
  const dateLabel = new Date(event.date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
  });

  return (
    <div
      className={cn(
        "grid gap-[var(--spacing-gutter-lg)] md:grid-cols-2 md:items-center",
        className,
      )}
    >
      <Image asset={event.coverImage} sizes="(min-width: 768px) 50vw, 100vw" />
      <div className="flex flex-col gap-4">
        <Text variant="muted" className="text-xs tracking-wide uppercase">
          {dateLabel}
          {event.location ? ` · ${event.location}` : ""}
        </Text>
        <Heading level={2}>
          <Link href={eventHref} variant="plain">
            {event.name}
          </Link>
        </Heading>
        {excerpt && <Text variant="body">{excerpt}</Text>}
        <ButtonLink href={eventHref} variant="secondary" className="self-start">
          Подробнее
        </ButtonLink>
      </div>
    </div>
  );
}

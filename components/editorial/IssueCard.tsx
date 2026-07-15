import type { Issue } from "@/types/content";
import type { EnabledLocale } from "@/lib/i18n/locales";
import { Link } from "@/components/ui/Link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { portableTextToPlainText } from "@/utils/portableTextToPlainText";
import { cn } from "@/utils/cn";

interface IssueCardProps {
  issue: Issue;
  locale: EnabledLocale;
  className?: string;
}

export function IssueCard({ issue, locale, className }: IssueCardProps) {
  const excerpt = portableTextToPlainText(issue.description, 140);
  const buyHref = issue.buyLinks?.[0]?.url;

  return (
    <article className={cn("flex flex-col gap-4", className)}>
      <Link
        href={`/${locale}/magazine/${issue.slug}`}
        variant="plain"
        className="group flex flex-col gap-4"
      >
        <Image
          asset={issue.coverImage}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="transition-opacity duration-[var(--duration-base)] ease-[var(--ease-standard)] group-hover:opacity-90"
        />
        <div className="flex flex-col gap-1">
          <Text variant="muted" className="text-xs tracking-wide uppercase">
            №{issue.number} · {issue.year}
          </Text>
          <Heading level={4}>{issue.title}</Heading>
          {excerpt && <Text variant="muted">{excerpt}</Text>}
        </div>
      </Link>
      {buyHref && (
        <ButtonLink href={buyHref} variant="secondary" size="sm" className="self-start">
          Купить
        </ButtonLink>
      )}
    </article>
  );
}

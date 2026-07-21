import type { Issue } from "@/types/content";
import type { EnabledLocale } from "@/lib/i18n/locales";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Link } from "@/components/ui/Link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { portableTextToPlainText } from "@/utils/portableTextToPlainText";
import { cn } from "@/utils/cn";

interface FeaturedIssueProps {
  issue: Issue;
  locale: EnabledLocale;
  className?: string;
}

// Single-issue spotlight — larger than the IssueCard grid treatment.
// Reusable anywhere one issue needs to be featured (homepage now,
// potentially a "latest issue" spot on /magazine later).
export function FeaturedIssue({ issue, locale, className }: FeaturedIssueProps) {
  const excerpt = portableTextToPlainText(issue.description, 220);
  const buyHref = issue.buyLinks?.[0]?.url;
  const issueHref = `/${locale}/magazine/${issue.slug}`;

  return (
    <div
      className={cn(
        "grid gap-[var(--spacing-gutter-lg)] md:grid-cols-2 md:items-center",
        className,
      )}
    >
      <Image asset={issue.coverImage} preset="editorial" sizes="(min-width: 768px) 50vw, 100vw" />
      <div className="flex flex-col gap-4">
        <Badge>
          №{issue.number} · {issue.year}
        </Badge>
        <Heading level={2}>
          <Link href={issueHref} variant="plain">
            {issue.title}
          </Link>
        </Heading>
        {excerpt && <Text variant="body">{excerpt}</Text>}
        <div className="flex flex-wrap gap-4">
          <ButtonLink href={issueHref} variant="secondary">
            Подробнее
          </ButtonLink>
          {buyHref && (
            <ButtonLink href={buyHref} variant="primary">
              Купить
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}

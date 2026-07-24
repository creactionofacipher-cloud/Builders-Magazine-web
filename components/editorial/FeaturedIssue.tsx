import type { Issue } from "@/types/content";
import type { EnabledLocale } from "@/lib/i18n/locales";
import { Grid } from "@/components/layout/Grid";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Link } from "@/components/ui/Link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { portableTextToPlainText } from "@/utils/portableTextToPlainText";
import { cn } from "@/utils/cn";

interface FeaturedIssueProps {
  issues: Issue[];
  locale: EnabledLocale;
  className?: string;
}

// Spotlights one or more issues, sharing a single per-issue card
// (FeaturedIssueCard below) so neither shape duplicates the other's
// markup. Exactly one issue gets the larger, side-by-side "spotlight"
// treatment (homepage/Layout Block usage, and this component's original
// only shape); more than one lays the same card out in a two-up Grid
// instead (e.g. the Buy page's latest-issues-for-sale showcase).
export function FeaturedIssue({ issues, locale, className }: FeaturedIssueProps) {
  if (issues.length === 0) return null;

  if (issues.length === 1) {
    return <FeaturedIssueCard issue={issues[0]} locale={locale} spotlight className={className} />;
  }

  return (
    <Grid columns={2} className={className}>
      {issues.map((issue) => (
        <FeaturedIssueCard key={issue.id} issue={issue} locale={locale} />
      ))}
    </Grid>
  );
}

interface FeaturedIssueCardProps {
  issue: Issue;
  locale: EnabledLocale;
  className?: string;
  /** The larger, side-by-side image+text treatment — only used when
   * FeaturedIssue renders exactly one issue. Multi-issue showcases stack
   * image above text instead, so each card stays legible at grid width. */
  spotlight?: boolean;
}

function FeaturedIssueCard({ issue, locale, className, spotlight = false }: FeaturedIssueCardProps) {
  const excerpt = portableTextToPlainText(issue.description, 220);
  const buyHref = issue.buyLinks?.[0]?.url;
  const issueHref = `/${locale}/magazine/${issue.slug}`;

  return (
    <div
      className={cn(
        "grid gap-[var(--spacing-gutter-lg)]",
        spotlight && "md:grid-cols-2 md:items-center",
        className,
      )}
    >
      <Image
        asset={issue.coverImage}
        preset="editorial"
        sizes={spotlight ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 640px) 50vw, 100vw"}
      />
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

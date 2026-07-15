import type { Metadata } from "next";
import { getAllIssues } from "@/cms/services/issues";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { IssueCard } from "@/components/editorial/IssueCard";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Журнал — архив номеров | Builders Magazine";
  const description =
    "Все номера печатного журнала Builders Magazine: обложки, описания и ссылки на покупку.";
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/magazine`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function MagazinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = isEnabledLocale(locale) ? locale : DEFAULT_LOCALE;
  const issues = await getAllIssues();

  return (
    <Section>
      <Container className="flex flex-col gap-[var(--spacing-gutter-lg)]">
        <div className="flex flex-col gap-2">
          <Heading level={1}>Журнал</Heading>
          <Text variant="muted">Архив печатных номеров Builders Magazine.</Text>
        </div>

        {issues.length > 0 ? (
          <Grid columns={3}>
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} locale={activeLocale} />
            ))}
          </Grid>
        ) : (
          <Text variant="muted">Номера появятся здесь совсем скоро.</Text>
        )}
      </Container>
    </Section>
  );
}

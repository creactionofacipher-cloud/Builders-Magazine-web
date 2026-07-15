import type { Metadata } from "next";
import { search } from "@/cms/services/search";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { StoryCollection } from "@/components/editorial/StoryCollection";
import { IssueCard } from "@/components/editorial/IssueCard";
import { BikeCard } from "@/components/editorial/BikeCard";
import { BuilderCard } from "@/components/editorial/BuilderCard";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = "Поиск | Builders Magazine";
  const description = "Поиск по историям, номерам журнала, мотоциклам и мастерским.";
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/search`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // Search results pages shouldn't be indexed per-query — every
    // possible ?q= value would otherwise register as a thin-content page.
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: settings.siteTitle,
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const activeLocale = isEnabledLocale(locale) ? locale : DEFAULT_LOCALE;
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const results = query
    ? await search(query)
    : { stories: [], issues: [], bikes: [], builders: [] };

  const totalCount =
    results.stories.length + results.issues.length + results.bikes.length + results.builders.length;

  return (
    <Section>
      <Container className="flex flex-col gap-[var(--spacing-gutter-lg)]">
        <div className="flex flex-col gap-2">
          <Heading level={1}>Поиск</Heading>
          <Text variant="muted">
            Ищите среди историй, номеров журнала, мотоциклов и мастерских.
          </Text>
        </div>

        <form
          action={`/${activeLocale}/search`}
          method="GET"
          role="search"
          className="flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <SearchInput name="q" defaultValue={query} placeholder="Например, Panhead или Ironhide" />
          <Button type="submit" className="sm:shrink-0">
            Найти
          </Button>
        </form>

        {query && (
          <Text variant="muted">
            {totalCount > 0 ? `Найдено: ${totalCount}` : `Ничего не найдено по запросу «${query}»`}
          </Text>
        )}

        {results.stories.length > 0 && (
          <StoryCollection title="Истории" stories={results.stories} locale={activeLocale} />
        )}

        {results.issues.length > 0 && (
          <div className="flex flex-col gap-8">
            <Heading level={2}>Журнал</Heading>
            <Grid columns={3}>
              {results.issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} locale={activeLocale} />
              ))}
            </Grid>
          </div>
        )}

        {results.bikes.length > 0 && (
          <div className="flex flex-col gap-8">
            <Heading level={2}>Мотоциклы</Heading>
            <Grid columns={3}>
              {results.bikes.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </Grid>
          </div>
        )}

        {results.builders.length > 0 && (
          <div className="flex flex-col gap-8">
            <Heading level={2}>Мастерские</Heading>
            <Grid columns={3}>
              {results.builders.map((builder) => (
                <BuilderCard key={builder.id} builder={builder} />
              ))}
            </Grid>
          </div>
        )}
      </Container>
    </Section>
  );
}

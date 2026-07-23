import type { Metadata } from "next";
import type { ReactNode } from "react";
import { search } from "@/cms/services/search";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { resolveOgImages, resolveTwitterImages } from "@/lib/seo/images";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { StoryCard } from "@/components/editorial/StoryCard";
import { IssueCard } from "@/components/editorial/IssueCard";
import { BuildersCupCard } from "@/components/editorial/BuildersCupCard";
import { ProductCard } from "@/components/editorial/ProductCard";
import { BikeCard } from "@/components/editorial/BikeCard";
import { BuilderCard } from "@/components/editorial/BuilderCard";
import { PersonCard } from "@/components/editorial/PersonCard";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = "Поиск | Builders Magazine";
  const description =
    "Поиск по историям, номерам журнала, Builders Cup, товарам, мотоциклам, мастерским и команде.";
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
      siteName: settings.defaultSEO?.siteName || settings.siteTitle,
      locale: "ru_RU",
      type: "website",
      images: resolveOgImages(settings),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resolveTwitterImages(settings),
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

  // The search page never knows where results came from (mock or Sanity)
  // — it only ever sees the SearchResults shape cms/services/search.ts
  // returns. When there's no query, it doesn't call search() at all
  // rather than calling it with an empty string.
  const results = query ? await search(query) : null;

  const groups: { key: string; title: string; count: number; content: ReactNode }[] = results
    ? [
        {
          key: "stories",
          title: "Истории",
          count: results.stories.length,
          content: (
            <Grid columns={3}>
              {results.stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  locale={activeLocale}
                  highlightQuery={query}
                />
              ))}
            </Grid>
          ),
        },
        {
          key: "issues",
          title: "Журнал",
          count: results.issues.length,
          content: (
            <Grid columns={3}>
              {results.issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  locale={activeLocale}
                  highlightQuery={query}
                />
              ))}
            </Grid>
          ),
        },
        {
          key: "buildersCup",
          title: "Builders Cup",
          count: results.buildersCup.length,
          content: (
            <Grid columns={3}>
              {results.buildersCup.map((event) => (
                <BuildersCupCard
                  key={event.id}
                  event={event}
                  locale={activeLocale}
                  highlightQuery={query}
                />
              ))}
            </Grid>
          ),
        },
        {
          key: "products",
          title: "Товары",
          count: results.products.length,
          content: (
            <Grid columns={3}>
              {results.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={activeLocale}
                  highlightQuery={query}
                />
              ))}
            </Grid>
          ),
        },
        {
          key: "bikes",
          title: "Мотоциклы",
          count: results.bikes.length,
          content: (
            <Grid columns={3}>
              {results.bikes.map((bike) => (
                <BikeCard key={bike.id} bike={bike} highlightQuery={query} />
              ))}
            </Grid>
          ),
        },
        {
          key: "builders",
          title: "Мастерские",
          count: results.builders.length,
          content: (
            <Grid columns={3}>
              {results.builders.map((builder) => (
                <BuilderCard key={builder.id} builder={builder} highlightQuery={query} />
              ))}
            </Grid>
          ),
        },
        {
          key: "people",
          title: "Команда",
          count: results.people.length,
          content: (
            <Grid columns={4}>
              {results.people.map((person) => (
                <PersonCard key={person.id} person={person} highlightQuery={query} />
              ))}
            </Grid>
          ),
        },
      ]
    : [];

  const totalCount = groups.reduce((sum, group) => sum + group.count, 0);

  return (
    <Section>
      <Container className="flex flex-col gap-[var(--spacing-gutter-lg)]">
        <Heading level={1}>Поиск</Heading>

        <form
          action={`/${activeLocale}/search`}
          method="GET"
          role="search"
          className="flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <SearchInput
            name="q"
            defaultValue={query}
            placeholder="Например, Panhead или Ironhide"
            aria-label="Поиск"
          />
          <Button type="submit" className="sm:shrink-0">
            Найти
          </Button>
        </form>

        {query &&
          (totalCount > 0 ? (
            <>
              <Text variant="muted">Найдено: {totalCount}</Text>
              {groups.map((group) =>
                group.count > 0 ? (
                  <div key={group.key} className="flex flex-col gap-8">
                    <Heading level={2}>
                      {group.title} ({group.count})
                    </Heading>
                    {group.content}
                  </div>
                ) : null,
              )}
            </>
          ) : (
            <Text variant="muted">Ничего не найдено по запросу «{query}»</Text>
          ))}
      </Container>
    </Section>
  );
}

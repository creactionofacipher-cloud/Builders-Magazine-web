import type { Metadata } from "next";
import { getStories } from "@/cms/services/stories";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { resolveOgImages, resolveTwitterImages } from "@/lib/seo/images";
import { isStoryCategory } from "@/utils/isStoryCategory";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { StoryCard } from "@/components/editorial/StoryCard";
import { StoryCategoryNav } from "@/components/editorial/StoryCategoryNav";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = "Истории — Builders Magazine";
  const description =
    "Цифровые материалы Builders Magazine: мотоциклы, мастера, культура кастома и интервью.";
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/stories`;

  return {
    title,
    description,
    alternates: { canonical: url },
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

export default async function StoriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const activeLocale = isEnabledLocale(locale) ? locale : DEFAULT_LOCALE;
  const { category } = await searchParams;
  const activeCategory = isStoryCategory(category) ? category : null;

  const stories = await getStories({ category: activeCategory });

  return (
    <Section>
      <Container className="flex flex-col gap-[var(--spacing-gutter-lg)]">
        <div className="flex flex-col gap-2">
          <Heading level={1}>Истории</Heading>
          <Text variant="muted">
            Цифровые материалы Builders Magazine: люди, мотоциклы и культура кастома.
          </Text>
        </div>

        <StoryCategoryNav active={activeCategory} />

        {stories.length > 0 ? (
          <Grid columns={3}>
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} locale={activeLocale} />
            ))}
          </Grid>
        ) : (
          <Text variant="muted">Материалов в этой категории пока нет.</Text>
        )}
      </Container>
    </Section>
  );
}

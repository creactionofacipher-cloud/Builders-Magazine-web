import type { Metadata } from "next";
import { getCurrentIssue } from "@/cms/services/issues";
import { getFeaturedContent, getFeaturedStories } from "@/cms/services/stories";
import { getLatestBuildersCup } from "@/cms/services/buildersCup";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/editorial/Hero";
import { FeaturedIssue } from "@/components/editorial/FeaturedIssue";
import { BuildersCupHighlight } from "@/components/editorial/BuildersCupHighlight";
import { StoryCollection } from "@/components/editorial/StoryCollection";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = "Builders Magazine — независимый журнал о кастомных мотоциклах";
  const description =
    "Цифровая платформа Builders Magazine: архив печатных номеров, эксклюзивные истории и Builders Cup.";
  const url = `${SITE_URL}/${DEFAULT_LOCALE}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: settings.siteTitle,
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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = isEnabledLocale(locale) ? locale : DEFAULT_LOCALE;

  const [currentIssue, featuredStories, featuredContent, latestBuildersCup, settings] =
    await Promise.all([
      getCurrentIssue(),
      getFeaturedStories(),
      getFeaturedContent(),
      getLatestBuildersCup(),
      getSiteSettings(),
    ]);

  return (
    <>
      {currentIssue && (
        <Hero
          image={currentIssue.coverImage}
          title={settings.siteTitle}
          subtitle={`Свежий номер: ${currentIssue.title}`}
          cta={{
            label: "Смотреть номер",
            href: `/${activeLocale}/magazine/${currentIssue.slug}`,
          }}
        />
      )}

      {currentIssue && (
        <Section>
          <Container>
            <FeaturedIssue issue={currentIssue} locale={activeLocale} />
          </Container>
        </Section>
      )}

      {featuredStories.length > 0 && (
        <Section surface>
          <Container>
            <StoryCollection
              title="Избранные истории"
              stories={featuredStories}
              locale={activeLocale}
            />
          </Container>
        </Section>
      )}

      {latestBuildersCup && (
        <Section>
          <Container>
            <BuildersCupHighlight event={latestBuildersCup} locale={activeLocale} />
          </Container>
        </Section>
      )}

      {featuredContent.length > 0 && (
        <Section surface>
          <Container>
            <StoryCollection
              title="Ещё материалы"
              stories={featuredContent}
              locale={activeLocale}
            />
          </Container>
        </Section>
      )}
    </>
  );
}

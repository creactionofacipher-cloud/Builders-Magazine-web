import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStories, getStoryBySlug } from "@/cms/services/stories";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { resolveOgImages, resolveTwitterImages } from "@/lib/seo/images";
import { buildArticleJsonLd } from "@/lib/seo/structuredData";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { RichText } from "@/components/ui/RichText";
import { Gallery } from "@/components/ui/Gallery";
import { Hero } from "@/components/editorial/Hero";
import { BikeCard } from "@/components/editorial/BikeCard";
import { BuilderCard } from "@/components/editorial/BuilderCard";

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return { title: "Материал не найден | Builders Magazine" };
  }

  const settings = await getSiteSettings();
  const title = `${story.title} | Builders Magazine`;
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/stories/${story.slug}`;

  return {
    title,
    description: story.shortDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: story.shortDescription,
      url,
      siteName: settings.defaultSEO?.siteName || settings.siteTitle,
      locale: "ru_RU",
      type: "article",
      images: resolveOgImages(settings, story.coverImage),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: story.shortDescription,
      images: resolveTwitterImages(settings, story.coverImage),
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const [story, settings] = await Promise.all([getStoryBySlug(slug), getSiteSettings()]);

  if (!story) {
    notFound();
  }

  const publishedDateLabel = new Date(story.publishedDate).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasRelatedContent =
    (story.relatedBike && story.relatedBike.length > 0) ||
    (story.relatedBuilder && story.relatedBuilder.length > 0);

  return (
    <>
      <JsonLd data={buildArticleJsonLd(story, settings)} />
      <Hero
        image={story.coverImage}
        title={story.title}
        subtitle={story.shortDescription}
        lightbox
      />

      <Section>
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{story.category}</Badge>
              <Text variant="muted" className="text-sm">
                {story.author ? `${story.author.name} · ` : ""}
                {publishedDateLabel}
              </Text>
            </div>
            <RichText value={story.content} />
          </div>
        </Container>
      </Section>

      {story.gallery && story.gallery.length > 0 && (
        <Section surface>
          <Container className="flex flex-col gap-8">
            <Heading level={2}>Галерея</Heading>
            <Gallery images={story.gallery} />
          </Container>
        </Section>
      )}

      {hasRelatedContent && (
        <Section>
          <Container className="flex flex-col gap-[var(--spacing-gutter-lg)]">
            {story.relatedBike && story.relatedBike.length > 0 && (
              <div className="flex flex-col gap-8">
                <Heading level={2}>Мотоцикл в материале</Heading>
                <Grid columns={3}>
                  {story.relatedBike.map((bike) => (
                    <BikeCard key={bike.id} bike={bike} />
                  ))}
                </Grid>
              </div>
            )}
            {story.relatedBuilder && story.relatedBuilder.length > 0 && (
              <div className="flex flex-col gap-8">
                <Heading level={2}>Мастерская</Heading>
                <Grid columns={3}>
                  {story.relatedBuilder.map((builder) => (
                    <BuilderCard key={builder.id} builder={builder} />
                  ))}
                </Grid>
              </div>
            )}
          </Container>
        </Section>
      )}
    </>
  );
}

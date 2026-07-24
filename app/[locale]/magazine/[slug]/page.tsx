import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllIssues, getIssueBySlug } from "@/cms/services/issues";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { resolveOgImages, resolveTwitterImages } from "@/lib/seo/images";
import { buildIssueJsonLd } from "@/lib/seo/structuredData";
import { JsonLd } from "@/components/seo/JsonLd";
import { portableTextToPlainText } from "@/utils/portableTextToPlainText";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { RichText } from "@/components/ui/RichText";
import { Image } from "@/components/ui/Image";
import { Gallery } from "@/components/ui/Gallery";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StoryCollection } from "@/components/editorial/StoryCollection";

export async function generateStaticParams() {
  const issues = await getAllIssues();
  return issues.map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getIssueBySlug(slug);

  if (!issue) {
    return { title: "Номер не найден | Builders Magazine", robots: { index: false } };
  }

  const settings = await getSiteSettings();
  const title = `${issue.title} | Builders Magazine`;
  const description =
    portableTextToPlainText(issue.description, 160) || `Номер ${issue.number}, ${issue.year} год.`;
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/magazine/${issue.slug}`;

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
      type: "article",
      images: resolveOgImages(settings, issue.coverImage),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resolveTwitterImages(settings, issue.coverImage),
    },
  };
}

export default async function IssuePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const activeLocale = isEnabledLocale(locale) ? locale : DEFAULT_LOCALE;
  const [issue, settings] = await Promise.all([getIssueBySlug(slug), getSiteSettings()]);

  if (!issue) {
    notFound();
  }

  const releaseDateLabel = new Date(issue.releaseDate).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd data={buildIssueJsonLd(issue, settings)} />
      <Section>
        <Container className="grid gap-[var(--spacing-gutter-lg)] md:grid-cols-2 md:items-start">
          <Image
            asset={issue.coverImage}
            preset="editorial"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            lightbox
          />
          <div className="flex flex-col gap-4">
            <Badge>
              №{issue.number} · {issue.year}
            </Badge>
            <Heading level={1}>{issue.title}</Heading>
            <Text variant="muted">{releaseDateLabel}</Text>
            {issue.description && <RichText value={issue.description} />}
            {issue.buyLinks && issue.buyLinks.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-2">
                {issue.buyLinks.map((link) => (
                  <ButtonLink
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                  >
                    {link.label}
                  </ButtonLink>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {issue.featuredStories && issue.featuredStories.length > 0 && (
        <Section surface>
          <Container>
            <StoryCollection
              title="Материалы номера"
              stories={issue.featuredStories}
              locale={activeLocale}
            />
          </Container>
        </Section>
      )}

      {issue.gallery && issue.gallery.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-8">
            <Heading level={2}>Галерея</Heading>
            <Gallery images={issue.gallery} {...issue.gallerySettings} />
          </Container>
        </Section>
      )}
    </>
  );
}

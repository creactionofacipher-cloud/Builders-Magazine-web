import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBuildersCupEvents, getBuildersCupEventBySlug } from "@/cms/services/buildersCup";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { resolveOgImages, resolveTwitterImages } from "@/lib/seo/images";
import { portableTextToPlainText } from "@/utils/portableTextToPlainText";
import { buildEventJsonLd } from "@/lib/seo/structuredData";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { RichText } from "@/components/ui/RichText";
import { Image } from "@/components/ui/Image";
import { GallerySection } from "@/components/ui/GallerySection";
import { BikeCard } from "@/components/editorial/BikeCard";

export async function generateStaticParams() {
  const events = await getAllBuildersCupEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getBuildersCupEventBySlug(slug);

  if (!event) {
    return { title: "Событие не найдено | Builders Magazine", robots: { index: false } };
  }

  const settings = await getSiteSettings();
  const title = `${event.name} | Builders Magazine`;
  const description =
    portableTextToPlainText(event.description, 160) ||
    `${event.name}${event.location ? ` — ${event.location}` : ""}.`;
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/builders-cup/${event.slug}`;

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
      images: resolveOgImages(settings, event.coverImage),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resolveTwitterImages(settings, event.coverImage),
    },
  };
}

export default async function BuildersCupEventPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([
    getBuildersCupEventBySlug(slug),
    getSiteSettings(),
  ]);

  if (!event) {
    notFound();
  }

  const dateLabel = new Date(event.date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd data={buildEventJsonLd(event, settings)} />
      <Section>
        <Container className="grid gap-[var(--spacing-gutter-lg)] md:grid-cols-2 md:items-start">
          <Image
            asset={event.coverImage}
            preset="editorial"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            lightbox
          />
          <div className="flex flex-col gap-4">
            <Text variant="muted" className="text-xs tracking-wide uppercase">
              {dateLabel}
              {event.location ? ` · ${event.location}` : ""}
            </Text>
            <Heading level={1}>{event.name}</Heading>
            {event.description && <RichText value={event.description} />}
          </div>
        </Container>
      </Section>

      {event.participants && event.participants.length > 0 && (
        <Section surface>
          <Container className="flex flex-col gap-8">
            <Heading level={2}>Участники</Heading>
            <Grid columns={3}>
              {event.participants.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      {event.winners && event.winners.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-8">
            <Heading level={2}>Победители</Heading>
            <Grid columns={3}>
              {event.winners.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </Grid>
          </Container>
        </Section>
      )}

      <GallerySection images={event.gallery} settings={event.gallerySettings} surface />
    </>
  );
}

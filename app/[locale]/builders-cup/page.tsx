import type { Metadata } from "next";
import { getAllBuildersCupEvents } from "@/cms/services/buildersCup";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { BuildersCupHighlight } from "@/components/editorial/BuildersCupHighlight";
import { BuildersCupCard } from "@/components/editorial/BuildersCupCard";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Builders Cup | Builders Magazine";
  const description =
    "Официальная платформа Builders Cup: последний слёт, прошедшие события, участники и победители.";
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/builders-cup`;

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

export default async function BuildersCupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = isEnabledLocale(locale) ? locale : DEFAULT_LOCALE;
  const events = await getAllBuildersCupEvents();
  const [latest, ...previous] = events;

  return (
    <>
      <Section>
        <Container className="flex flex-col gap-[var(--spacing-gutter-lg)]">
          <div className="flex flex-col gap-2">
            <Heading level={1}>Builders Cup</Heading>
            <Text variant="muted">
              Официальная платформа слёта кастомных мотоциклов Builders Cup.
            </Text>
          </div>

          {latest ? (
            <BuildersCupHighlight event={latest} locale={activeLocale} />
          ) : (
            <Text variant="muted">Информация о ближайшем событии появится совсем скоро.</Text>
          )}
        </Container>
      </Section>

      {previous.length > 0 && (
        <Section surface>
          <Container className="flex flex-col gap-8">
            <Heading level={2}>Предыдущие события</Heading>
            <Grid columns={3}>
              {previous.map((event) => (
                <BuildersCupCard key={event.id} event={event} locale={activeLocale} />
              ))}
            </Grid>
          </Container>
        </Section>
      )}
    </>
  );
}

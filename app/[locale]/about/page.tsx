import type { Metadata } from "next";
import { getCrew } from "@/cms/services/people";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Link } from "@/components/ui/Link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PersonCard } from "@/components/editorial/PersonCard";

// Mission/Philosophy/Contacts/Cooperation now come from cms/services/siteSettings
// (docs/03_CONTENT_MODEL.md's Site Settings singleton, mock-backed until
// Milestone 10). Crew comes from cms/services/people (Person entity).
// The intro lede below and this page's own generateMetadata are
// page-specific copy, not site-wide settings, so they stay local to this file.

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = "О журнале | Builders Magazine";
  const description =
    "Builders Magazine: миссия, философия, команда и возможности для сотрудничества.";
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/about`;

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

export default async function AboutPage() {
  const [crew, settings] = await Promise.all([getCrew(), getSiteSettings()]);
  const mailtoHref = `mailto:${settings.contacts.email}`;

  return (
    <>
      <Section>
        <Container className="flex flex-col gap-2">
          <Heading level={1}>О журнале</Heading>
          <Text variant="lead" className="max-w-2xl">
            Builders Magazine — независимый печатный журнал о культуре кастомных мотоциклов и людях,
            которые её создают.
          </Text>
        </Container>
      </Section>

      <Section surface>
        <Container className="flex max-w-2xl flex-col gap-4">
          <Heading level={2}>Миссия</Heading>
          <Text>{settings.mission}</Text>
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-8">
          <Heading level={2}>Команда</Heading>
          <Grid columns={4}>
            {crew.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </Grid>
        </Container>
      </Section>

      <Section surface>
        <Container className="flex max-w-2xl flex-col gap-4">
          <Heading level={2}>Философия</Heading>
          <Text>{settings.philosophy}</Text>
        </Container>
      </Section>

      <Section>
        <Container className="flex max-w-2xl flex-col gap-4">
          <Heading level={2}>Контакты</Heading>
          <Text>
            Email: <Link href={mailtoHref}>{settings.contacts.email}</Link>
          </Text>
          {settings.contacts.city && <Text variant="muted">{settings.contacts.city}</Text>}
        </Container>
      </Section>

      <Section surface>
        <Container className="flex max-w-2xl flex-col gap-4">
          <Heading level={2}>Сотрудничество</Heading>
          <Text>{settings.cooperation}</Text>
          <ButtonLink href={mailtoHref} variant="primary" className="self-start">
            Написать нам
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}

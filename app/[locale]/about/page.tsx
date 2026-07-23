import type { Metadata } from "next";
import { getAllPeople } from "@/cms/services/people";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { PERSON_GROUPS, PERSON_GROUP_LABELS } from "@/types/content";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { resolveOgImages, resolveTwitterImages } from "@/lib/seo/images";
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

// Block order: О журнале → Философия → Миссия → Команда/Фотографы →
// Контакты (+ Social Links) → Сотрудничество — matches both Site
// Settings' Studio field order (studio/schemas/siteSettings.ts) and
// types/content.ts's SiteSettings field order, so the three stay easy
// to keep in sync by eye.
export default async function AboutPage() {
  const [people, settings] = await Promise.all([getAllPeople(), getSiteSettings()]);
  const mailtoHref = `mailto:${settings.contacts.email}`;
  // Email is the one field this page treats as always-present (it's the
  // mailto: target for both the Contacts and Cooperation sections) — the
  // rest are optional editorial copy blocks, hidden entirely rather than
  // rendered empty when an editor hasn't filled them in yet.
  const socialLinks = (settings.contacts.socialLinks ?? []).filter(
    (link) => link.label && link.url,
  );
  const hasContacts = Boolean(
    settings.contacts.email || settings.contacts.city || socialLinks.length > 0,
  );

  return (
    <>
      <Section>
        <Container className="flex flex-col gap-2">
          <Heading level={1}>О журнале</Heading>
          {settings.siteDescription && (
            <Text variant="lead" className="max-w-2xl">
              {settings.siteDescription}
            </Text>
          )}
        </Container>
      </Section>

      {settings.philosophy && (
        <Section surface>
          <Container className="flex max-w-2xl flex-col gap-4">
            <Heading level={2}>Философия</Heading>
            <Text>{settings.philosophy}</Text>
          </Container>
        </Section>
      )}

      {settings.mission && (
        <Section>
          <Container className="flex max-w-2xl flex-col gap-4">
            <Heading level={2}>Миссия</Heading>
            <Text>{settings.mission}</Text>
          </Container>
        </Section>
      )}

      {PERSON_GROUPS.map((group) => {
        const members = people.filter((person) => person.groups?.includes(group));
        if (members.length === 0) return null;

        return (
          <Section key={group}>
            <Container className="flex flex-col gap-8">
              <Heading level={2}>{PERSON_GROUP_LABELS[group]}</Heading>
              <Grid columns={4}>
                {members.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </Grid>
            </Container>
          </Section>
        );
      })}

      {hasContacts && (
        <Section surface>
          <Container className="flex max-w-2xl flex-col gap-4">
            <Heading level={2}>Контакты</Heading>
            {settings.contacts.email && (
              <Text>
                Email: <Link href={mailtoHref}>{settings.contacts.email}</Link>
              </Text>
            )}
            {settings.contacts.city && <Text variant="muted">{settings.contacts.city}</Text>}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <Link key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </Container>
        </Section>
      )}

      {settings.cooperation && (
        <Section>
          <Container className="flex max-w-2xl flex-col gap-4">
            <Heading level={2}>Сотрудничество</Heading>
            <Text>{settings.cooperation}</Text>
            <ButtonLink href={mailtoHref} variant="primary" className="self-start">
              Написать нам
            </ButtonLink>
          </Container>
        </Section>
      )}
    </>
  );
}

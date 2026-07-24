import type { Metadata } from "next";
import { getLatestIssuesForSale } from "@/cms/services/issues";
import { getMerchandise } from "@/cms/services/products";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { resolveOgImages, resolveTwitterImages } from "@/lib/seo/images";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Link } from "@/components/ui/Link";
import { FeaturedIssue } from "@/components/editorial/FeaturedIssue";
import { ProductCard } from "@/components/editorial/ProductCard";

// MVP: external purchase links only — no shopping cart, no checkout, no
// payments (docs/02_SITE_STRUCTURE.md, docs/10_POST_MVP.md Phase 3). The
// Product type/service exist specifically so the future /shop build-out
// replaces cms/services/products.ts without touching this page or
// ProductCard.

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = "Купить | Builders Magazine";
  const description = "Печатный журнал и мерч Builders Magazine.";
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/buy`;

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

export default async function BuyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = isEnabledLocale(locale) ? locale : DEFAULT_LOCALE;

  const [latestIssues, merchandise] = await Promise.all([getLatestIssuesForSale(2), getMerchandise()]);

  return (
    <>
      <Section>
        <Container className="flex flex-col gap-2">
          <Heading level={1}>Купить</Heading>
          <Text variant="lead" className="max-w-2xl">
            Печатный журнал и мерч Builders Magazine.
          </Text>
        </Container>
      </Section>

      <Section surface>
        <Container className="flex flex-col gap-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <Heading level={2}>Журнал</Heading>
            <Link href={`/${activeLocale}/magazine`}>Смотреть все номера</Link>
          </div>
          {latestIssues.length > 0 ? (
            <FeaturedIssue issues={latestIssues} locale={activeLocale} />
          ) : (
            <Text variant="muted">Скоро здесь появится актуальный номер.</Text>
          )}
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-8">
          <Heading level={2}>Мерч</Heading>
          {merchandise.length > 0 ? (
            <Grid columns={4}>
              {merchandise.map((product) => (
                <ProductCard key={product.id} product={product} locale={activeLocale} />
              ))}
            </Grid>
          ) : (
            <Text variant="muted">Мерч скоро появится.</Text>
          )}
        </Container>
      </Section>
    </>
  );
}

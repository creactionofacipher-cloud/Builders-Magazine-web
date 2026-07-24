import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMerchandise, getProductBySlug, getRelatedProducts } from "@/cms/services/products";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { resolveOgImages, resolveTwitterImages } from "@/lib/seo/images";
import { buildProductJsonLd } from "@/lib/seo/structuredData";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { RichText } from "@/components/ui/RichText";
import { Image } from "@/components/ui/Image";
import { Gallery } from "@/components/ui/Gallery";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProductCard } from "@/components/editorial/ProductCard";

export async function generateStaticParams() {
  const products = await getMerchandise();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Товар не найден | Builders Magazine", robots: { index: false } };
  }

  const settings = await getSiteSettings();
  const title = `${product.name} | Builders Magazine`;
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/buy/merchandise/${product.slug}`;

  return {
    title,
    description: product.shortDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: product.shortDescription,
      url,
      siteName: settings.defaultSEO?.siteName || settings.siteTitle,
      locale: "ru_RU",
      type: "website",
      images: resolveOgImages(settings, product.mainImage),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.shortDescription,
      images: resolveTwitterImages(settings, product.mainImage),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const activeLocale = isEnabledLocale(locale) ? locale : DEFAULT_LOCALE;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const priceLabel = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: product.currency,
    maximumFractionDigits: 0,
  }).format(product.price);

  const relatedProducts = await getRelatedProducts(product.slug);

  return (
    <>
      <JsonLd data={buildProductJsonLd(product)} />
      <Section>
        <Container className="grid gap-[var(--spacing-gutter-lg)] md:grid-cols-2 md:items-start">
          <Image
            asset={product.mainImage}
            preset="editorial"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            lightbox
          />
          <div className="flex flex-col gap-4">
            <Heading level={1}>{product.name}</Heading>
            <Text variant="lead">{priceLabel}</Text>

            {product.description && <RichText value={product.description} />}

            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-col gap-2">
                <Text variant="muted" className="text-xs tracking-wide uppercase">
                  Размеры
                </Text>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Badge key={size}>{size}</Badge>
                  ))}
                </div>
              </div>
            )}

            {product.materials && (
              <div className="flex flex-col gap-2">
                <Text variant="muted" className="text-xs tracking-wide uppercase">
                  Материал
                </Text>
                <Text>{product.materials}</Text>
              </div>
            )}

            {product.externalBuyUrl && (
              <ButtonLink
                href={product.externalBuyUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="self-start"
              >
                Купить
              </ButtonLink>
            )}
          </div>
        </Container>
      </Section>

      {product.gallery && product.gallery.length > 0 && (
        <Section surface>
          <Container className="flex flex-col gap-8">
            <Heading level={2}>Галерея</Heading>
            <Gallery images={product.gallery} {...product.gallerySettings} />
          </Container>
        </Section>
      )}

      {relatedProducts.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-8">
            <Heading level={2}>Похожие товары</Heading>
            <Grid columns={3}>
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} locale={activeLocale} />
              ))}
            </Grid>
          </Container>
        </Section>
      )}
    </>
  );
}

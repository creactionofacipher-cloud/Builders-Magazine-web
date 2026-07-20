import type { Product } from "@/types/content";
import type { EnabledLocale } from "@/lib/i18n/locales";
import { Link } from "@/components/ui/Link";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { HighlightText } from "@/components/ui/HighlightText";
import { cn } from "@/utils/cn";

interface ProductCardProps {
  product: Product;
  locale: EnabledLocale;
  className?: string;
  /** Highlights the matching substring in the title — set when this card
   * renders inside search results. Omitted everywhere else. */
  highlightQuery?: string;
}

// Whole card is a Link to the detail page, same pattern as StoryCard —
// no nested anchor issue because there's no second interactive element
// on the card. The external purchase button lives only on the detail
// page (/buy/merchandise/[slug]).
export function ProductCard({ product, locale, className, highlightQuery }: ProductCardProps) {
  const priceLabel = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: product.currency,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link
      href={`/${locale}/buy/merchandise/${product.slug}`}
      variant="plain"
      className={cn("group flex flex-col gap-3", className)}
    >
      <Image
        asset={product.mainImage}
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="transition-opacity duration-[var(--duration-base)] ease-[var(--ease-standard)] group-hover:opacity-90"
      />
      <div className="flex flex-col gap-1">
        <Text variant="muted" className="text-xs tracking-wide uppercase">
          {priceLabel}
        </Text>
        <Heading level={4}>
          <HighlightText text={product.name} query={highlightQuery} />
        </Heading>
        <Text variant="muted">{product.shortDescription}</Text>
      </div>
    </Link>
  );
}
